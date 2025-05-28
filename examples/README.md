# Plaint test typescript example to use Coffeeless Validator

## Seting up local testing:

### Option 1

1. Use npm link (Symlink for Development)

This method creates a symbolic link between the package and the examples/plain-typescript folder, allowing you to test changes in real-time.

In the package root directory run:
```
npm link
```
This command creates a global symlink to the package.

2. In examples/plain-typescript directory:
```
npm link coffeeless-form
```
This links the global symlink to your examples/plain-typescript folder's node_modules.


3. Import the package in index.ts:
```
import { ValidationBuilder as Builder } from 'coffeeless-form/dist';
```

### Option 2

1. Use npm pack (Simulate NPM Package)

This method creates a tarball of the package, simulating how it would be published to NPM.

In the package root directory run:
```
npm pack
```
This command generates a .tgz file, e.g., coffeeless-form-1.0.0.tgz.

2. In the examples/plain-typescript directory:
```
npm install ../../coffeeless-form-1.0.0.tgz
```

3. Import then package in index.ts:
import { yourFunction } from 'coffeeless-form';


## Start the test:

```
npm run start
```