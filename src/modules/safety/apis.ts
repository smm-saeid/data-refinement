const module = 'safety';

const researchApis = {

  developmentPlan: {
    list: `${module}/development-plans`,
    save: `${module}/development-plans`,
    update: `${module}/development-plans/{id}`,
  },
  axis: {
    // می‌توانید endpointهای مربوط به axis را اینجا اضافه کنید
  },
  messages: {
    list: `${module}/messages`,
    markAsRead: `${module}/messages/{id}/read`,
  },
  forms: {
    list: `${module}/forms`,
    save: `${module}/forms`,
    update: `${module}/forms/{id}`,
    delete: `${module}/forms/{id}`,
  },
  NewsLetter:{
    aja
     :{
        save: `${module}/api/newsletter/aja/save`,
        list: `${module}/api/newsletter/aja/list`,
        update: `${module}/api/newsletter/aja/update/{id}`,
        delete:`${module}/api/newsletter/aja/delete/{id}`,
        patch:`${module}/api/newsletter/aja/archive/{id}`,
    } ,
     nahaja :{
        save: `${module}/api/newsletter/nahaja/save`,
        list: `${module}/api/newsletter/nahaja/list`,
        update: `${module}/api/newsletter/nahaja/update/{id}`,
        delete:`${module}/api/newsletter/nahaja/delete/{id}`,
        patch:`${module}/api/newsletter/nahaja/archive/{id}`,
    } ,
     nezaja :{
        save: `${module}/api/newsletter/nezaja/save`,
        list: `${module}/api/newsletter/nezaja/list`,
        update: `${module}/api/newsletter/nezaja/update/{id}`,
        delete:`${module}/api/newsletter/nezaja/delete/{id}`,
        patch:`${module}/api/newsletter/nezaja/archive/{id}`,
    } ,
     nedaja :{
        save: `${module}/api/newsletter/nedaja/save`,
        list: `${module}/api/newsletter/nedaja/list`,
        update: `${module}/api/newsletter/nedaja/update/{id}`,
        delete:`${module}/api/newsletter/nedaja/delete/{id}`,
        patch:`${module}/api/newsletter/nedaja/archive/{id}`,
    } ,
     pedaja :{
        save: `${module}/api/newsletter/pedaja/save`,
        list: `${module}/api/newsletter/pedaja/list`,
        update: `${module}/api/newsletter/pedaja/update/{id}`,
        delete:`${module}/api/newsletter/pedaja/delete/{id}`,
        patch:`${module}/api/newsletter/pedaja/archive/{id}`,
    } ,
  


  }
};

export default researchApis;