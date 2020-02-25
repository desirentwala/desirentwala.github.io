import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfigService } from '../../../../core/services/config.service';
import { Logger } from '../../../../core/ui-components/logger/logger';
import { MakeModelInfo } from '../models/makemodelinfo.model';

@Injectable()
export class MakeModelService {
 config: ConfigService;
  makeModelInfo;
  constructor(public formBuilder: FormBuilder, public _logger: Logger, _config: ConfigService) {

    this.config = _config;
    this.makeModelInfo = new MakeModelInfo(formBuilder);

   }

   getMakeModelInfo(){
    return this.makeModelInfo.getMakeModelInfo();
  }

/*   getmakesearchmodel() {
    return this.makeModelInfo.getsearchmodal();
  } */

  getMakeListInfo() {
    return this.makeModelInfo.getMakeListInfo();
  } 

  getModelListInfo() {
    return this.makeModelInfo.getModelListInfo();
  } 

  getModelList() {
    return this.makeModelInfo.getModelListInfo();
  } 

  setMakeModelInfo(obj) {
    this.makeModelInfo.setMakeModelInfo(obj);
  }
  
  createMake(inputJson) {
    return this.config.ncpRestServiceCall('aux/insertMakeModel', inputJson);
  }

  createModel(inputJson) {
    return this.config.ncpRestServiceCall('aux/insertMakeModel', inputJson);
  }

  /* getMakeCreationDetails(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('aux/getMakeModel', inputJson);
  } */

  getMakeModelList(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('aux/getMakeModelList', inputJson);
  }
  

  deleteMake(inputJson) {
    let deleteuser = this.config.ncpRestServiceCall('aux/deleteMakeModel', inputJson);
    return deleteuser;
  }


  getMakeModelDetails(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('aux/getMakeModelDetails', inputJson);
  }

  updateMake(inputJson) {
    let makeupdate = this.config.ncpRestServiceCall('aux/updateMakeModel', inputJson);
    return makeupdate;
  }
  updateModel(inputJson) {
    let makeupdate = this.config.ncpRestServiceCall('aux/updateMakeModel', inputJson);
    return makeupdate;
  }
}
