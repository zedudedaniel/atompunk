function skillCheck(skillName, difficultyClass, partyMember) {
	return Math.random() * 99 + 1 + state.team[partyMember][skillName] >= difficultyClass;
}

function invUpdate(itemName, amount) {
	var itemBag = state.team.inventory;
	//In the future, change this to be the team's bag
	if (typeof itemBag[itemName] === 'undefined') {
		itemBag[itemName] = 0;
	}
	itemBag[itemName] += amount;
}

function invCheck(itemName, amount) {
	return _.get(state, 'team.inventory.' + itemName, 0) >= amount;
}