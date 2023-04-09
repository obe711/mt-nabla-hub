const allRoles = {
  user: ['getUsers', 'manageUsers', 'getServers', 'manageServers'],
  admin: ['getUsers', 'manageUsers', 'getServers', 'manageServers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
