# Amazon Lambda Rust Library

<!--BEGIN STABILITY BANNER-->

---

![rust.aws-cdk-lambda: Stable](https://img.shields.io/badge/rust.aws--cdk--lambda-stable-success.svg?style=for-the-badge)
[![npm](https://img.shields.io/npm/v/rust.aws-cdk-lambda?style=for-the-badge)](https://www.npmjs.com/package/rust.aws-cdk-lambda)

> **This is unofficial CDK library based on the [Amazon Lambda Node.js] and [aws-lambda-rust] Libraries.**
>
> _It's intended for use with the new **[AWS CDK v2]**_.

[aws cdk v2]: https://aws.amazon.com/about-aws/whats-new/2021/12/aws-cloud-development-kit-cdk-generally-available/
[amazon lambda node.js]: https://www.npmjs.com/package/@aws-cdk/aws-lambda-nodejs
[aws-lambda-rust]: https://www.npmjs.com/package/aws-lambda-rust

---

<!--END STABILITY BANNER-->

This library provides a construct for a Rust Lambda function.

It uses [`cross`] for building Rust code, and follows best practices as outlined
in the [official AWS documentation].

[docker]: https://www.docker.com/get-started
[`cross`]: https://github.com/rust-embedded/cross
[official aws documentation]: https://docs.aws.amazon.com/sdk-for-rust/latest/dg/lambda.html

## Rust Fuction

The `RustFunction` construct creates a Lambda function with automatic bundling and compilation of Rust code.

It uses [Docker] and [`cross`] under the hood.

## Examples

You can find sample CDK apps built using _Typescript_ or _Node.js_ in the [cdk-examples/] folder of the GitHub project repo.

[cdk-examples/]: https://github.com/rnag/rust.aws-cdk-lambda/tree/main/cdk-examples

## Getting Started

1. Install the [npm](https://nodejs.org/) package:

    ```shell
    $ npm i rust.aws-cdk-lambda
    ```

2) Use [`cargo`] to install _rust-embedded/cross_:

    ```shell
    $ cargo install cross
    ```

3. Install the **x86_64-unknown-linux-musl** toolchain with Rustup by running:

    ```shell
    $ rustup target add x86_64-unknown-linux-musl
    ```

Finally, ensure you have [Docker] installed and running, as it will be used by `cross` to compile Rust code for deployment.

[`cargo`]: https://www.rust-lang.org/

## Usage

First, import the construct:

```ts
import { RustFunction } from 'rust.aws-cdk-lambda';
```

Now define a `RustFunction`:

```ts
new RustFunction(this, 'my-handler', {});
```

By default, the construct will use directory where `cdk` was invoked as directory where Cargo files are located.

If no `bin` or `package` argument is passed in, it will default to the package name as defined in the main `Cargo.toml`.

Alternatively, `directory` and `bin` can be specified:

```ts
new RustFunction(this, 'MyLambdaFunction', {
    directory: '/path/to/directory/with/Cargo.toml',
    // Optional
    bin: 'my_lambda',
});
```

All other properties of `lambda.Function` are supported, see also the [AWS Lambda construct library](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/aws-lambda).

## Multiple Rust Lambdas

Assuming you have a CDK project with more than one Rust
lambda, there are a couple approaches - as outlined below -
that you can use to deploy with `cdk`.

### Multiple Binaries

Suppose your project layout looks like this:

```
.
├── Cargo.toml
└── src
    └── bin
        ├── lambda1.rs
        └── lambda2.rs
```

Here's one way to deploy that:

```
new RustFunction(this, "my-function-1", {
    bin: "lambda1",
});

new RustFunction(this, "my-function-2", {
    bin: "lambda2",
});
```

### Multiple Packages

Suppose you use [Workspaces] in your Cargo project instead.

The full contents of the main `Cargo.toml` would need to be updated
to look like this:

```
[workspace]
members = [
    "lambda1",
    "lambda2"
]
```

And your new project layout would now look similar to this:

```
.
├── Cargo.lock
├── Cargo.toml
├── lambda1
│   ├── Cargo.toml
│   └── src
│       ├── main.rs
│       └── utils.rs
└── lambda2
    ├── Cargo.toml
    └── src
        ├── main.rs
        └── utils.rs
```

Where the `utils.rs` files are optional, but the point being that they can be imported
by the lambda handlers in `main.rs` if desired.

Now you will only need to update your CDK code to pass `package` instead,
for each workspace member:

```
new RustFunction(this, "MyFirstRustFunction", {
    package: "lambda1",
});

new RustFunction(this, "MySecondRustFunction", {
    package: "lambda2",
});
```

[workspaces]: https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html
