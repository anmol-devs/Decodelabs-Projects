'use strict';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const state = {
      navActiveClass: 'is-active',
      ctaInitialLabel: 'Build the Future',
      ctaLoadingLabel: 'Initializing...'
    };

    const navLinks = document.querySelectorAll('nav ul li a');
    const navButton = document.querySelector('nav button');
    const article = document.querySelector('article');

    if (navLinks.length > 0) {
      const clearNavActiveState = () => {
        navLinks.forEach((link) => {
          link.classList.remove(state.navActiveClass);
          link.removeAttribute('aria-current');
        });
      };

      navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          clearNavActiveState();
          link.classList.add(state.navActiveClass);
          link.setAttribute('aria-current', 'page');
        });

        link.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            link.click();
          }
        });
      });
    }

    if (navButton) {
      navButton.addEventListener('click', () => {
        navButton.textContent = state.ctaLoadingLabel;
        navButton.setAttribute('disabled', 'true');

        window.setTimeout(() => {
          navButton.textContent = state.ctaInitialLabel;
          navButton.removeAttribute('disabled');
        }, 2000);
      });
    }

    if (article) {
      const handleCardNavigation = (link, event) => {
        if (!link || !article.contains(link) || link.textContent?.trim().startsWith('Learn More') !== true) {
          return;
        }

        event.preventDefault();
        const card = link.closest('section');
        const cardHeading = card?.querySelector('h3');
        const headingText = cardHeading ? cardHeading.textContent?.trim() : '';

        if (headingText) {
          console.log(`Navigation triggered for: ${headingText}`);
        }
      };

      article.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
          return;
        }

        const link = target.closest('a');
        handleCardNavigation(link, event);
      });

      article.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }

        const target = event.target;
        if (!(target instanceof Element)) {
          return;
        }

        const link = target.closest('a');
        handleCardNavigation(link, event);
      });
    }
  },
  { once: true }
);
