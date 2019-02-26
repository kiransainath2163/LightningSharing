({

	doInit : function(component) {
		component.find('navService').navigate({
			type: 'standard__component',
			attributes: {
				componentName: 'ltngsharing__LightningSharing'
			},
			state: {
				'ltngsharing__recordId': component.get('v.recordId')
			}
		});
	}

})