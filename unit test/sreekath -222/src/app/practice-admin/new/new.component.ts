import { Component, OnInit } from '@angular/core';
import { Vet } from './vet.model';


@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {
  model = new Vet();
  imgUrl: any;
  heading: string;
  petId: any;
  imagePath: any;
  genderList: any = [];
  speciesList: any = [];
  MAX_SPECIES_ITEMS = 3;
  status: boolean;
  speciesData = [
    {pic: 'pet.jpg', speciesName: 'Dog'},
    {pic: 'pet.jpg', speciesName: 'Rabbit'},
    {pic: 'pet.jpg', speciesName: 'Cat'},
];
  constructor(

  ) { }


  ngOnInit() {
    if (!this.imgUrl) {
      this.imgUrl = '../../../assets/profile-picture.png';
    }
  }


  createPet() {

  }

  /**
   * update pet picture
   */
  vetPicUpdate(event) {
    const files = event.target.files;
    if (files && files.length === 0) {
      return;
    } else if(files){
      const mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
      }
      const reader = new FileReader();
      this.imagePath = files;
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        this.imgUrl = reader.result;
      };
    }
  }
  /**
   * active class set for species selection
   * @param speciesData species data on selection
   * @param index index of the species data
   */
  selectedSpecies(species) {

  }

  /**
   * show more species
   */
  showMoreSpecies() {
    this.MAX_SPECIES_ITEMS += this.speciesList.length;
  }

  /**
   * show less species
   */
  showLessSpecies() {
    this.MAX_SPECIES_ITEMS -= this.speciesList.length;
  }
}
