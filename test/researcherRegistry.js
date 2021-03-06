var ResearcherRegistry = artifacts.require('./ResearcherRegistry');

contract('ResearcherRegistry', function(accounts) {
  let registry
  let owner = accounts[0]

  beforeEach(async () => {
    registry = await ResearcherRegistry.new()
    await registry.getID('testresearcher', 'test@email.com', {from: accounts[1]})
  })

  it('Should add a pending researcher.', async () => {
    let researcher = await registry.pendingIndex(0)
    let data = await registry.pendingResearchers(accounts[1])
    let name = web3.toUtf8(String(data[0]))
    let email = web3.toUtf8(String(data[1]))

    assert.equal(accounts[1], researcher, 'The researcher was not added to pendingIndex.');
    assert.equal('testresearcher', name, 'The name was not added to pendingResearchers.')
    assert.equal('test@email.com', email, 'The email was not added to pendingResearchers.')
  })

  it('Should login a researcher with valid ID', async () => {
    // The owner is initialized as a researcher in the contract constructor.
    let ownerNameHex = await registry.login({from: owner})
    let ownerName = web3.toUtf8(String(ownerNameHex))
    assert.equal('Mauro', ownerName, 'The owner should be able to login after contract initialitiation.')
  })

  it('Owner should be able to approve a researcher ID.', async () => {
    // Aprove ID by owner
    await registry.approveID(accounts[1], {from: owner})
    // Check that it's now a researcher
    let researcher = await registry.researcherIndex(1)
    let researcherName = web3.toUtf8(String(await registry.researchers(accounts[1])))
    assert.equal(accounts[1], researcher, 'The researcher was not added to researcherIndex.');
    assert.equal('testresearcher', researcherName, 'The name was not added to researchers mapping.')
    // Check that it's no longer a pending researcher.
    let pendingResearcher = await registry.pendingIndex(0)
    let [ pendingName, pendingEmail ] = await registry.pendingResearchers(accounts[1])
    assert.equal(0x0, pendingResearcher, 'The researcher should be removed from pendingIndex')
    assert.equal(0x0, pendingName, 'The researcher name should be erased from pendingResearchers.')
    assert.equal(0x0, pendingEmail, 'The researcher email should be erased from pendingResearchers.')
  })

  it('Owner should be able to reject a researcher ID.', async () => {
    await registry.rejectID(accounts[1], {from: owner})
    // Check that it's no longer a pending researcher
    let pendingResearcher = await registry.pendingIndex(0)
    let [ pendingName, pendingEmail ] = await registry.pendingResearchers(accounts[1])

    assert.equal(0x0, pendingResearcher, 'The researcher should be removed from pendingIndex')
    assert.equal(0x0, pendingName, 'The researcher name should be removed from pendingResearchers')
    assert.equal(0x0, pendingEmail, 'The researcher email should be erased from pendingResearchers.')
  })

  it('Owner should be able to revoke a researcher ID.', async () => {
    await registry.approveID(accounts[1], {from: owner})
    await registry.revokeID(accounts[1], {from: owner})
    // Check that it's no longer a researcher
    let researcher = await registry.researcherIndex(1)
    let [ researcherName, researcherEmail ] = await registry.researchers(accounts[1])

    assert.equal(0x0, researcher, 'The researcher should be removed from researcherIndex')
    assert.equal(0x0, researcherName, 'The researcher name should be removed from researcherResearchers')
    assert.equal(0x0, researcherEmail, 'The researcher email should be removed from researcherResearchers')
  })
});
