export const OutputIds = {
    SetDataSourceDone: 'setDataSourceDone'
  };
  export const InputIds = {
    SetDataSource: 'setDataSource',
  };
  
  
  export interface Data {
    items: {
      url: string,
      id: string
    }[];
    mode: boolean
    autoplay: {
      enabled: boolean, 
      delay: number
    }
    loop:boolean
    slidesPerView: number
    spaceBetween:number
    speed:number,
  }
  