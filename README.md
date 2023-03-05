### README

GuardianUI.com static web site code and public product demos (under `tests/`).

# Background

End-to-end (E2E) tests check the functionality of a system by simulating real-world scenarios and interactions between different components. Developers traditionally do not write end-to-end tests because they are time-consuming and difficult to maintain.

Some reasons for this include:

- Complexity: E2E tests need to simulate real-world scenarios and interactions between different components making tests difficult to write and maintain.
- Time-consuming: The general rule is for every 1 hour of development, you should perform 1 hour writing tests to maintain high test coverage. This can slow down the development process, and writing tests isn’t as exciting as shipping new features.
- Fragility: E2E tests are prone to breaking because they depend on the behavior of many different components such as CSS styling, third party component library dependencies and many other factors making it hard to reliably pinpoint the location of a component in the HTML DOM tree in a programmatic way. This can make it difficult to keep tests current.
- Cost: E2E tests can be expensive to write and maintain, as they require a significant investment of time and resources.

For non-web3 interactions, the stakes aren’t as high if things break. Perhaps a user can’t create a new account, which leads to frustration and them never trying the app again. That’s bad for business, but that’s pretty much where it ends.

The stakes are much higher for web3 applications.

If an app’s UI doesn’t match what’s happening at the smart contract level, users may get hacked and/or lose funds (e.g. giving the wrong contract address access to their funds). Meanwhile, the app’s development team has no way to know this is happening. 

To streamline an increase in test coverage, we’re developing a way for E2E tests to be created using natural language. Combined with our [E2E testing framework](https://www.guardianui.com/), this will make it much easier for web3 apps to create safer and more robust experiences for users.

### Here’s an example how natural language can be used to create a test:

User Story:

1. Go to https://app.uniswap.org/

2. Click on Get started button at the lower center.

3. Select the dropdown menu that says ETH at the upper right.

4. Click on the option that says Wrapped Ether.

5. Select the dropdown menu that says Select token in the middle of the screen.

6. Select the option that says Aave.

### Benefits include:

- Anybody can write tests, not just devs. No coding required.
- Free up developers' time because not having to spend as much time writing tests.
- Get higher test coverage while reducing cost
- Tests are less brittle (Using referring expressions means tests won’t break when the location of a component in the HTML DOM tree changes for whatever reason.)

In [this demo video](https://www.youtube.com/watch?v=x95IAEvADvc), you will see the user story from above in a markdown file, which is automatically converted into test code and run.

#Team
GuardianUI is co-founded by:
- [Ivelin Ivanov](https://github.com/ivelin) - tech entrepreneur and open source contributor
- [Lienid](https://github.com/0xLienid) - FE and smart contract developer at OlympusDAO
- [Jem](https://github.com/0xJem) - Full stack developer at OlympusDAO
- [Marshall Lipman](https://github.com/lipmaneth) - co-founder SporosDAO, prev head of BD @jtv.com
