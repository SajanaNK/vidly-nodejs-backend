SET vidly_jwtPrivateKey=mySecureKey


SET NODE_ENV=test


node --experimental-vm-modules node_modules/jest/bin/jest.js --watchAll --verbose --detectOpenHandles --coverage