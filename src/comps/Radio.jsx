import React from 'react'
import { Form, Radio } from 'semantic-ui-react';

export default function Radioo ({ name, values, checked, onChange }) {
  return (
    <Form>
      {
        values.map((value, i) => (
          <Form.Field key={i}>
            <Radio
              className='p-2'
              name={name}
              checked={checked===value}
              value={value}
              onChange={onChange}
              label={value}
            />
          </Form.Field>
        ))
      }
    </Form>
  )
}