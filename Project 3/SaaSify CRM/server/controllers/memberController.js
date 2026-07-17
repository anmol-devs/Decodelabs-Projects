const Member = require('../models/Member');
const Activity = require('../models/Activity');

// @desc    Create a new member
// @route   POST /api/users
// @access  Private
const createMember = async (req, res, next) => {
  try {
    const { name, email, phone, age, city, role, status } = req.body;

    if (!name || !email || !phone || !age || !city) {
      res.status(400);
      throw new Error('Please fill in all required fields.');
    }

    // Check if email already exists in member directory
    const memberExists = await Member.findOne({ email });
    if (memberExists) {
      res.status(400);
      throw new Error('A member with this email address already exists in the directory.');
    }

    const member = await Member.create({
      name,
      email,
      phone,
      age,
      city,
      role: role || 'User',
      status: status || 'Active',
      createdBy: req.user._id,
    });

    // Log Activity
    await Activity.create({
      user: req.user._id,
      action: 'CREATE',
      details: `Created member: ${member.name} (${member.role})`,
    });

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all members (with search, filter, sort, and pagination)
// @route   GET /api/users
// @access  Private
const getMembers = async (req, res, next) => {
  try {
    const query = {};

    // 1. Search (Name, Email, City)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { city: searchRegex },
      ];
    }

    // 2. Filters
    if (req.query.role && req.query.role !== 'All') {
      query.role = req.query.role;
    }
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }
    if (req.query.city && req.query.city !== 'All') {
      query.city = req.query.city;
    }

    // 3. Sorting
    let sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default
    }

    // 4. Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Member.countDocuments(query);
    const pages = Math.ceil(total / limit);

    const members = await Member.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      pagination: {
        total,
        pages,
        page,
        limit,
      },
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single member details
// @route   GET /api/users/:id
// @access  Private
const getMemberById = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!member) {
      res.status(404);
      throw new Error('Member not found.');
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a member's record
// @route   PUT /api/users/:id
// @access  Private (Admin only or restricted update access)
const updateMember = async (req, res, next) => {
  try {
    const { name, email, phone, age, city, role, status } = req.body;

    let member = await Member.findById(req.params.id);

    if (!member) {
      res.status(404);
      throw new Error('Member not found.');
    }

    // Check email uniqueness if email is being updated
    if (email && email !== member.email) {
      const emailExists = await Member.findOne({ email });
      if (emailExists) {
        res.status(400);
        throw new Error('A member with this email address already exists in the directory.');
      }
    }

    member.name = name || member.name;
    member.email = email || member.email;
    member.phone = phone || member.phone;
    member.age = age !== undefined ? age : member.age;
    member.city = city || member.city;
    member.role = role || member.role;
    member.status = status || member.status;

    const updatedMember = await member.save();

    // Log Activity
    await Activity.create({
      user: req.user._id,
      action: 'UPDATE',
      details: `Updated member details: ${updatedMember.name}`,
    });

    res.json({
      success: true,
      data: updatedMember,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete member record
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      res.status(404);
      throw new Error('Member not found.');
    }

    const memberName = member.name;
    await member.deleteOne();

    // Log Activity
    await Activity.create({
      user: req.user._id,
      action: 'DELETE',
      details: `Deleted member: ${memberName}`,
    });

    res.json({
      success: true,
      message: 'Member removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics, aggregations, and recent activities
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: 'Active' });

    // Aggregate average age
    const ageStats = await Member.aggregate([
      {
        $group: {
          _id: null,
          avgAge: { $avg: '$age' },
        },
      },
    ]);
    const averageAge = ageStats.length > 0 ? Math.round(ageStats[0].avgAge * 10) / 10 : 0;

    // Aggregate city counts for charting
    const cityDistribution = await Member.aggregate([
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 }, // top 8 cities
      {
        $project: {
          name: '$_id',
          value: '$count',
          _id: 0,
        },
      },
    ]);

    // Aggregate role counts for charting
    const roleDistribution = await Member.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: '$_id',
          value: '$count',
          _id: 0,
        },
      },
    ]);

    // Get unique cities for filter dropdown lists in the frontend
    const citiesList = await Member.distinct('city');

    // Retrieve recent activities
    const recentActivities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name role');

    res.json({
      success: true,
      data: {
        stats: {
          totalMembers,
          activeMembers,
          averageAge,
        },
        charts: {
          cityDistribution,
          roleDistribution,
        },
        cities: citiesList,
        activities: recentActivities,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
  getDashboardStats,
};
