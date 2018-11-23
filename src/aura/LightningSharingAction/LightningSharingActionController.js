({

	doInit : function(component) {
		component.find('navService').navigate({
			type: 'standard__component',
			attributes: {
				componentName: 'ltngsharing__LightningSharing'
			},
			state: {
				"c__recordId": component.get('v.recordId')
			}
		}, true);
		$A.get("e.force:closeQuickAction").fire();
	}

})