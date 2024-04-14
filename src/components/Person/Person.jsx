import React from 'react'
import * as styles from './Person.module.scss'

const Person = ({name, img}) => {
  return (
    name &&
<div className={styles.card}>
  <img src={img} alt="avatar" />
  <h5>{name}</h5>
</div>
  )
}

export default Person