import { TestBed, inject } from '@angular/core/testing';

import { StockMenuService } from './stockMenu.service';

describe('StockMenuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockMenuService]
    });
  });

  it('should be created', inject([StockMenuService], (service: StockMenuService) => {
    expect(service).toBeTruthy();
  }));
});
