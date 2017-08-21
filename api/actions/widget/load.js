const initialWidgets = [
  { key: 1, name: 'John Brown',age: 1 ,street: 'Lake Park', building: 'C', number: 2035, companyAddress: 'Lake Street 42',companyName: 'SoftLake Co', gender: 'M', },
  { key: 2, name: 'John Brown',age: 2,street: 'Lake Park', building: 'C', number: 2035, companyAddress: 'Lake Street 42',companyName: 'SoftLake Co', gender: 'M', },
  { key: 3, name: 'John Brown',age: 3,street: 'Lake Park', building: 'C', number: 2035, companyAddress: 'Lake Street 42',companyName: 'SoftLake Co', gender: 'M', },
  { key: 4, name: 'John Brown',age: 4,street: 'Lake Park', building: 'C', number: 2035, companyAddress: 'Lake Street 42',companyName: 'SoftLake Co', gender: 'M', },
  { key: 5, name: 'John Brown',age: 5,street: 'Lake Park', building: 'C', number: 2035, companyAddress: 'Lake Street 42',companyName: 'SoftLake Co', gender: 'M', },
  { key: 6, name: 'John Brown',age: 6,street: 'Lake Park', building: 'C', number: 2035, companyAddress: 'Lake Street 42',companyName: 'SoftLake Co', gender: 'M', },
];

export function getWidgets(req) {
  let widgets = req.session.widgets;
  if (!widgets) {
    widgets = initialWidgets;
    req.session.widgets = widgets;
  }
  return widgets;
}

export default function load(req) {
  return new Promise((resolve, reject) => {
    // make async call to database
    setTimeout(() => {
      if (Math.random() < 0.33) {
        reject('Widget load fails 33% of the time. You were unlucky.');
      } else {
        resolve(getWidgets(req));
      }
    }, 1000); // simulate async load
  });
}
