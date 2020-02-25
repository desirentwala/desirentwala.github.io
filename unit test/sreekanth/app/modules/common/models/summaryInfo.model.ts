import { DefaultPolicyModel } from '../services/defaultModel.service';

export class SummaryInfo {
	_summaryInfoForm;
	constructor(public quoteModelInstance: DefaultPolicyModel) {
		this._summaryInfoForm = this.quoteModelInstance._formBuilderInstance;
	}
	getSummaryInfoModel() {

		return this._summaryInfoForm.group({
			premiumPrime: [''],
			premiumBase: [''],
			clientPremiumPrime: [''],
			clientPremiumBase: [''],
			discountPrime: [''],
			discountBase: [''],
			chargesPrime: [''],
			chargesBase: [''],
			taxPrime: [''],
			taxBase: [''],
			commissionPrime: [''],
			commissionBase: [''],
			commissionTaxPrime: [''],
			commissionTaxBase: [''],
			netPremiumPrime: [''],
			netPremiumBase: [''],
			siPrime: [''],
			liability:['0'],
			physicalDamage:['0'],
			warAggLimit:['0'],
			triaLimit:['0'],
			additionalCoverages:['0'],
			tax:['0'],
			grossPremium:['0'],
			netPremium:['0'],
			alternateDescription:[''],
			taxDesc:['0'],
			otherDesc:['0'],
		});
	}

	getMotorSummaryInfoModel() {

		return this._summaryInfoForm.group({
			clientPremiumPrime: [''],
			clientPremiumBase: [''],
			premiumPrime: [''],
			premiumBase: [''],
			discountPrime: [''],
			discountBase: [''],
			chargesPrime: [''],
			chargesBase: [''],
			taxPrime: [''],
			taxBase: [''],
			commissionPrime: [''],
			commissionBase: [''],
			commissionTaxPrime: [''],
			commissionTaxBase: [''],
			netPremiumPrime: [''],
			netPremiumBase: [''],
			siPrime: [''],
			excessAmt: [''],
			clientPremium: [''],
			instPremium: [''],
		});
	}

	getPASummaryInfoModel() {

		return this._summaryInfoForm.group({
			premiumPrime: [''],
			clientPremiumPrime: [''],
			clientPremiumBase: [''],
			premiumBase: [''],
			discountPrime: [''],
			discountBase: [''],
			chargesPrime: [''],
			chargesBase: [''],
			taxPrime: [''],
			taxBase: [''],
			commissionPrime: [''],
			commissionBase: [''],
			commissionTaxPrime: [''],
			commissionTaxBase: [''],
			netPremiumPrime: [''],
			netPremiumBase: [''],
			siPrime: ['']
		});
	}
}
