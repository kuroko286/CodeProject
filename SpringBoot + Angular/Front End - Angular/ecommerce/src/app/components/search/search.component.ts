import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @ViewChild('myInput') myInput;
  constructor(private router:Router,private productService:ProductService) { }

  ngOnInit(): void {
  }
  handleSearch(keyword:string){
    this.router.navigateByUrl(`/search/${keyword}`);
    this.myInput.nativeElement.value = '';
  }
}
