# `backend`

> TODO: description

## Instructions to run

Before running the `backend` you would need the `powersOfTau28_hez_final_14.ptau`, `circuits/semaphore01` and `circuits/semaphore02` files. To generate them you can run the following commands:

```bash
# 1. Install circom following https://docs.circom.io/getting-started/installation/

# 2. Install snarkjs
npm install -g snarkjs

# 3. Clone the semaphore repo
git clone https://github.com/semaphore-protocol/semaphore

# 4. Move to the circuits folder
cd packages/circuits

# 5. Install dependencies
yarn install

# 6. Remember to change ../node_modules to ../../node_modules
# in semaphore.circom and tree.circom

# 7. Generate the circuits
circom --r1cs --wasm -o ./ ./semaphore.circom

# 8. Download the .ptau file
wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau

# 9. Generate the 0001 key
snarkjs g16s ./semaphore.r1cs ./powersOfTau28_hez_final_15.ptau semaphore_0001.zkey

# 10. Generate the 0002 key
snarkjs g16s ./semaphore.r1cs ./powersOfTau28_hez_final_15.ptau semaphore_0002.zkey
```

To run the `backend` package you need to follow and execute these steps:

```bash
# 1. Install dependencies
yarn install

# 2. Run the backend
yarn backend start
```

## Usage

```
const backend = require('backend');

// TODO: DEMONSTRATE API
```
