const bcrypt = require('bcrypt');
const userRepo = require('../repositories/user.repo');
const projectRepo = require('../repositories/project.repo');
const ApiError = require('../utils/ApiError');
const { paginationMeta } = require('../utils/paginate');
const { publicUser } = require('./auth.service');

const listUsers = async ({ page, limit, skip, ...filters }) => {
  const { data, total } = await userRepo.list({ skip, limit, ...filters });
  return { data: data.map(publicUser), pagination: paginationMeta(page, limit, total) };
};

const getUser = async (id) => {
  const user = await userRepo.findById(id);
  if (!user) throw new ApiError(404, 'NOT_FOUND', 'User not found');
  return publicUser(user);
};

const updateStatus = (id, status) => userRepo.update(id, { status: status.toUpperCase() }).then(publicUser);

const deleteUser = async (requesterId, id) => {
  if (requesterId === id) throw new ApiError(400, 'SELF_DELETE_BLOCKED', 'You cannot delete your own account');
  const leadAssignment = await require('../config/db.postgres').projectMember.findFirst({ where: { userId: id, role: 'lead' } });
  if (leadAssignment) throw new ApiError(400, 'PROJECT_LEAD_DELETE_BLOCKED', 'Cannot delete an assigned project lead');
  return userRepo.remove(id).then(publicUser);
};

const inviteClient = async ({ projectId, name, email, password }) => {
  const project = await projectRepo.findById(projectId);
  if (!project) throw new ApiError(404, 'NOT_FOUND', 'Project not found');
  if (project.clientId) throw new ApiError(409, 'PROJECT_HAS_CLIENT', 'Project already has a linked client');
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new ApiError(409, 'EMAIL_EXISTS', 'Email is already registered');
  const client = await userRepo.create({
    name,
    email,
    password: await bcrypt.hash(password, 12),
    role: 'CLIENT'
  });
  await projectRepo.update(projectId, { clientId: client.id });
  return publicUser(client);
};

module.exports = { listUsers, getUser, updateStatus, deleteUser, inviteClient };
