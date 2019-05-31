/* eslint-disable import/no-mutable-exports */
// eslint-disable-next-line prefer-const
let db = [
  {
    id: 1,
    treatmentPlan: [
      { title: 'Pulsas', postfix: 'k./min' },
      { title: 'Kraujospūdis', postfix: 'mmHg' },
      { title: 'Temperatūra', postfix: '°C' },
      { title: 'Gliukozės kiekis', postfix: 'mmol/l' },
    ],
    drugs: [
      { title: 'Paracetamolis', id: 1 },
    ],
    ehrs: [],
  },
];

export default db;
