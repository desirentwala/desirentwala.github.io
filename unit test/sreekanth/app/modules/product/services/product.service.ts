import { ConfigService } from '../../../core/services/config.service';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductDetailsService {
    productCode: string;
    constructor(public configService: ConfigService) {
    };
    setproductCode(productDetailsCode) {
        this.productCode = productDetailsCode;
    }
    getProductCode() {
        return this.productCode;
    }
    getEnvCode() {
        return environment.country;
    }
    setB2b2cProductCode(productList) {
        if (productList) {
            this.productCode = productList[0].code;
        }
    }
}
