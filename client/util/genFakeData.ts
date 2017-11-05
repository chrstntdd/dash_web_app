import * as faker from 'faker';
import * as moment from 'moment';

const storeHours = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM'
];

/*  This file will be used to stub out data for the views;
 *  Methods will be called and the data returned will be used in each graph
 *
 */

export const salesAndVisits = () => {
  return [
    { name: 'Sales', value: faker.random.number({ min: 10, max: 500 }) },
    { name: 'Visits', value: faker.random.number({ min: 50, max: 500 }) }
  ];
};

export const dailyCustomers = () => {
  const momentHour = moment().hour();
  let currentHour;

  /* used to return proper amount of data points given the time of day
   */

  if (momentHour > 12) {
    currentHour = `${momentHour - 12}:00 PM`;
  } else {
    currentHour = `${momentHour}:00 AM`;
  }

  let returnData;

  if (storeHours.indexOf(currentHour) === -1) {
    returnData = storeHours.map(hour => ({
      hour,
      Customers: faker.random.number({ min: 10, max: 100 })
    }));
  } else {
    const activeStoreHours = storeHours.slice(
      0,
      storeHours.indexOf(currentHour) + 1
    );
    returnData = activeStoreHours.map(hour => ({
      hour,
      Customers: faker.random.number({ min: 10, max: 100 })
    }));
  }
  return returnData;
};

export const incSalesAndVisits = (sales: number, visits: number) => ({
  sales: Math.round(sales + Math.random() * 10),
  visits: Math.round(visits + Math.random() * 10)
});

export const genScatterData = (dataPoints: number) => {
  let returnData = [];

  for (let i = 0; i < dataPoints; i++) {
    const dataPoint = {
      time: storeHours[Math.round(Math.random() * storeHours.length)],
      customers: faker.random.number({ min: 10, max: 100 }),
      z: 100
    };
    returnData.push(dataPoint);
  }

  return returnData;
};
