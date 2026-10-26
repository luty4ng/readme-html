export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Permit Chinese subjects and retain common names such as GitHub and HTML.
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
  },
};
