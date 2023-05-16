function generatePrompt(diff) {
  const prompt = `This is the diff for a pull request:\n ${diff} \n I want you to create a change request form based on the information in the pull request. The change request form should answer the following questions:\n1.Reason for change.\n2. Desired outcome of change.\n3.Rollout plan.\n4.Backout or Rollback Plan\n5. Services/Applications Affected.\n6.Users/Departments Affected\n7.Resource Requirements\n8.Communication Plan\n9.Test Details`

  return prompt
}

module.exports = generatePrompt
