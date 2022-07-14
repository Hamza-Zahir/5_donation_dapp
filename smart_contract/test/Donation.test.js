const Donation = artifacts.require("./Donation.sol");

contract("Donation", (accounts) => {
  before(async () => {
    this.Donation = await Donation.deployed();
  });

  it("deploys successfully", async () => {
    const address = await this.Donation.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });
  it("Check uploadImage function", async () => {
    let result;
    const imgHash = "test123test123test";
    const description = "test image";
    let imageCount;
    result = await this.Donation.uploadImage(imgHash, description, {
      from: accounts[0],
    });
    imageCount = await this.Donation.imageCount();
    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(), 1);
    assert.equal(event.imgHash, imgHash);
    assert.equal(event.description, description);
    assert.equal(event.donationAmount, 0);
    assert.equal(event.author, accounts[0]);
    assert.equal(imageCount.toNumber(), 1);
  });
  it("Check Image", async () => {
    let image = await this.Donation.images(1);
    assert.equal(image.id.toNumber(), 1);
    assert.equal(image.imgHash, "test123test123test");
    assert.equal(image.description, "test image");
    assert.equal(image.donationAmount, 0);
    assert.equal(image.author, accounts[0]);
  });
  it("Allow users to donate", async () => {
    let imageCount = 1;
    const oldAuthorBalance = await web3.eth.getBalance(accounts[0]);
    const donateAmount = web3.utils.toWei("1", "Ether");
    const result = await this.Donation.donateImageOwner(imageCount, {
      from: accounts[0],
      value: donateAmount,
    });
    const newAuthorBalance = await web3.eth.getBalance(accounts[0]);
    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(), imageCount);
    assert.equal(event.donationAmount, donateAmount);
    assert.notEqual(oldAuthorBalance, newAuthorBalance);
  });
});
