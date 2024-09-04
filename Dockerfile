# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    libssl-dev \
    libudev-dev \
    pkg-config \
    zlib1g-dev \
    llvm \
    clang \
    make \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Solana v1.18.18
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.18.18/install)"
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install Anchor
RUN cargo install --git https://github.com/project-serum/anchor anchor-cli --locked

# Verify installations
RUN node --version && \
    npm --version && \
    rustc --version && \
    solana --version && \
    anchor --version

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the current directory contents into the container
COPY . .

# Expose port 3000 for Next.js
EXPOSE 3000

# Command to run when starting the container
CMD ["bash"]