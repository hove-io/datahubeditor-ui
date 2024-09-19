// @flow

export const FIELD_PROPS = [
  {
    inputType: 'DROPDOWN',
    props: {
      componentClass: 'select'
    }
  },
  {
    inputType: 'NUMBER',
    props: {
      type: 'number'
    }
  },
  {
    inputType: 'POSITIVE_INT',
    props: {
      min: 0,
      step: 1,
      type: 'number'
    }
  },
  {
    inputType: 'POSITIVE_NUM',
    props: {
      min: 0,
      type: 'number'
    }
  },
  {
    inputType: 'TIME',
    props: {
      placeholder: 'HH:mm:ss'
    }
  },
  {
    inputType: 'LATITUDE',
    props: {
      type: 'number'
    }
  },
  {
    inputType: 'LONGITUDE',
    props: {
      type: 'number'
    }
  }
]
