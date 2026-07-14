const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2}))?$/;
const ALLOWED_FIELDS = ['title', 'description', 'status', 'priority', 'dueDate'];

const isValidDate = (value) => {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value !== 'string' || !ISO_DATE_REGEX.test(value)) {
    return false;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  return calendarDate.getUTCFullYear() === year
    && calendarDate.getUTCMonth() + 1 === month
    && calendarDate.getUTCDate() === day;
};

const normalizeEnum = (value, allowedValues) => {
  if (typeof value !== 'string') {
    return value;
  }

  const normalized = value.trim().toUpperCase().replace(/-/g, '_');
  return allowedValues.includes(normalized) ? normalized : value;
};

const normalizeTaskInput = (body = {}) => {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return body;
  }

  const normalized = { ...body };

  if (normalized.title !== undefined && typeof normalized.title === 'string') {
    normalized.title = normalized.title.trim();
  }

  if (normalized.status !== undefined) {
    normalized.status = normalizeEnum(normalized.status, STATUSES);
  }

  if (normalized.priority !== undefined) {
    normalized.priority = normalizeEnum(normalized.priority, PRIORITIES);
  }

  return normalized;
};

const validateTaskId = (id) => {
  const errors = [];

  if (!id || typeof id !== 'string' || id.trim() === '') {
    errors.push('Task ID is required');
    return errors;
  }

  if (!UUID_REGEX.test(id)) {
    errors.push('Task ID must be a valid UUID');
  }

  return errors;
};

const validateRequestBody = (body) => {
  const errors = [];

  if (body === undefined || body === null || typeof body !== 'object' || Array.isArray(body)) {
    errors.push('Request body must be a valid JSON object');
  }

  return errors;
};

const validateTitle = (title, required = false) => {
  const errors = [];

  if (title === undefined) {
    if (required) {
      errors.push('Title is required');
    }
    return errors;
  }

  if (typeof title !== 'string') {
    errors.push('Title must be a string');
    return errors;
  }

  if (title.length === 0) {
    errors.push(required ? 'Title is required' : 'Title cannot be empty or whitespace');
    return errors;
  }

  if (title.length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (title.length > 100) {
    errors.push('Title must not exceed 100 characters');
  }

  return errors;
};

const validateDescription = (description) => {
  const errors = [];

  if (description === undefined) {
    return errors;
  }

  if (typeof description !== 'string') {
    errors.push('Description must be a string');
    return errors;
  }

  if (description.length > 500) {
    errors.push('Description must not exceed 500 characters');
  }

  return errors;
};

const validateStatus = (status, required = false) => {
  const errors = [];

  if (status === undefined) {
    if (required) {
      errors.push('Status is required');
    }
    return errors;
  }

  if (!STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${STATUSES.join(', ')}`);
  }

  return errors;
};

const validatePriority = (priority, required = false) => {
  const errors = [];

  if (priority === undefined) {
    if (required) {
      errors.push('Priority is required');
    }
    return errors;
  }

  if (!PRIORITIES.includes(priority)) {
    errors.push(`Priority must be one of: ${PRIORITIES.join(', ')}`);
  }

  return errors;
};

const validateDueDate = (dueDate) => {
  const errors = [];

  if (dueDate === undefined || dueDate === null) {
    return errors;
  }

  if (!isValidDate(dueDate)) {
    errors.push('Due date must be a valid date');
  }

  return errors;
};

const validateFullTask = (body) => {
  return [
    ...validateTitle(body.title, true),
    ...validateDescription(body.description),
    ...validateStatus(body.status, true),
    ...validatePriority(body.priority, true),
    ...validateDueDate(body.dueDate),
  ];
};

const validateAllowedFields = (body) => {
  return Object.keys(body)
    .filter((field) => !ALLOWED_FIELDS.includes(field))
    .map((field) => `Unexpected field: ${field}`);
};

const validateCreateOrReplaceTask = (body) => {
  const requestErrors = validateRequestBody(body);

  if (requestErrors.length > 0) {
    return requestErrors;
  }

  return [...validateAllowedFields(body), ...validateFullTask(body)];
};

const validateCreateTask = validateCreateOrReplaceTask;
const validateReplaceTask = validateCreateOrReplaceTask;

const validateUpdateTask = (body) => {
  const errors = [
    ...validateRequestBody(body),
  ];

  if (errors.length > 0) {
    return errors;
  }

  errors.push(...validateAllowedFields(body));

  const providedFields = ALLOWED_FIELDS.filter((field) => body[field] !== undefined);

  if (providedFields.length === 0) {
    errors.push('At least one field must be provided for update');
    return errors;
  }

  if (body.title !== undefined) {
    errors.push(...validateTitle(body.title));
  }

  if (body.description !== undefined) {
    errors.push(...validateDescription(body.description));
  }

  if (body.status !== undefined) {
    errors.push(...validateStatus(body.status));
  }

  if (body.priority !== undefined) {
    errors.push(...validatePriority(body.priority));
  }

  if (body.dueDate !== undefined) {
    errors.push(...validateDueDate(body.dueDate));
  }

  return errors;
};

module.exports = {
  STATUSES,
  PRIORITIES,
  isValidDate,
  normalizeTaskInput,
  validateTaskId,
  validateCreateTask,
  validateReplaceTask,
  validateUpdateTask,
};
