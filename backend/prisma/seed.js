const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const mongoose = require('mongoose');
const ActivityLog = require('../src/models/ActivityLog.model');

const prisma = new PrismaClient();

const main = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/clientpulse_logs';
  await mongoose.connect(mongoUri);
  await ActivityLog.deleteMany({});
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.projectTag.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const [adminPassword, memberPassword, clientPassword] = await Promise.all([
    bcrypt.hash('Admin@123', 12),
    bcrypt.hash('Member@123', 12),
    bcrypt.hash('Client@123', 12)
  ]);

  const admin = await prisma.user.create({
    data: { name: 'Avidus Admin', email: 'admin@clientpulse.dev', password: adminPassword, role: 'ADMIN' }
  });
  const alice = await prisma.user.create({
    data: { name: 'Alice Menon', email: 'alice@clientpulse.dev', password: memberPassword, role: 'MEMBER' }
  });
  const bob = await prisma.user.create({
    data: { name: 'Bob Thomas', email: 'bob@clientpulse.dev', password: memberPassword, role: 'MEMBER' }
  });
  const client = await prisma.user.create({
    data: { name: 'Acme Client', email: 'client@acmecorp.com', password: clientPassword, role: 'CLIENT' }
  });

  const project = await prisma.project.create({
    data: {
      name: 'Project Alpha',
      description: 'Digital commerce transformation for Acme Corp across discovery, UX, build, and launch.',
      status: 'IN_PROGRESS',
      healthScore: 72,
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-08-30'),
      budget: 125000,
      clientId: client.id,
      createdById: admin.id,
      tags: { create: [{ label: 'commerce' }, { label: 'ux' }, { label: 'transformation' }] },
      members: { create: [{ userId: alice.id, role: 'lead' }, { userId: bob.id, role: 'member' }] }
    }
  });

  const discovery = await prisma.milestone.create({
    data: {
      projectId: project.id,
      title: 'Discovery and stakeholder mapping',
      description: 'Interviews, current-state audit, and transformation roadmap.',
      status: 'COMPLETED',
      dueDate: new Date('2026-02-15'),
      completedAt: new Date('2026-02-12'),
      createdById: admin.id
    }
  });
  const design = await prisma.milestone.create({
    data: {
      projectId: project.id,
      title: 'UX prototypes and content model',
      description: 'Clickable flows, content taxonomy, and approval-ready designs.',
      status: 'IN_PROGRESS',
      dueDate: new Date('2026-06-20'),
      createdById: alice.id
    }
  });
  const launch = await prisma.milestone.create({
    data: {
      projectId: project.id,
      title: 'Pilot launch and optimization',
      description: 'Production pilot, training, analytics, and rollout checklist.',
      status: 'PENDING',
      dueDate: new Date('2026-08-25'),
      createdById: alice.id
    }
  });

  await prisma.task.createMany({
    data: [
      { milestoneId: discovery.id, title: 'Run stakeholder interviews', status: 'DONE', priority: 'HIGH', assignedToId: alice.id, createdById: admin.id, completedAt: new Date('2026-01-25') },
      { milestoneId: discovery.id, title: 'Document current process gaps', status: 'DONE', priority: 'MEDIUM', assignedToId: bob.id, createdById: admin.id, completedAt: new Date('2026-02-05') },
      { milestoneId: design.id, title: 'Create mobile checkout prototype', status: 'IN_REVIEW', priority: 'CRITICAL', assignedToId: alice.id, createdById: alice.id, dueDate: new Date('2026-05-31') },
      { milestoneId: design.id, title: 'Finalize CMS content types', status: 'IN_PROGRESS', priority: 'HIGH', assignedToId: bob.id, createdById: alice.id, dueDate: new Date('2026-06-05') },
      { milestoneId: launch.id, title: 'Prepare launch risk register', status: 'TODO', priority: 'MEDIUM', assignedToId: bob.id, createdById: alice.id, dueDate: new Date('2026-07-15') },
      { milestoneId: launch.id, title: 'Define KPI dashboard events', status: 'TODO', priority: 'HIGH', assignedToId: alice.id, createdById: admin.id, dueDate: new Date('2026-07-28') }
    ]
  });

  const actions = [
    'USER_LOGIN',
    'PROJECT_CREATED',
    'MEMBER_ADDED',
    'MEMBER_ADDED',
    'CLIENT_INVITED',
    'MILESTONE_CREATED',
    'TASK_CREATED',
    'TASK_ASSIGNED',
    'TASK_COMPLETED',
    'MILESTONE_COMPLETED'
  ];

  await ActivityLog.insertMany(
    actions.map((action, index) => ({
      action,
      performedBy: { userId: index < 5 ? admin.id : alice.id, name: index < 5 ? admin.name : alice.name, role: index < 5 ? 'admin' : 'member' },
      targetEntity: { type: 'project', id: project.id, name: project.name },
      projectId: project.id,
      metadata: { sample: true, sequence: index + 1 },
      createdAt: new Date(Date.now() - (10 - index) * 3600000),
      updatedAt: new Date(Date.now() - (10 - index) * 3600000)
    }))
  );

  console.log('Seeded ClientPulse demo data');
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await mongoose.disconnect();
  });
