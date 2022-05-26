import React, { InputHTMLAttributes, useEffect, useRef, useState } from 'react'
import { IconBaseProps } from 'react-icons'
import styles from './input.module.scss'
import {useField} from '@unform/core'
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon ?: React.ComponentType<IconBaseProps>
}


export const Input = ({name, icon: Icon , ...rest} : InputProps) => {
  const inputRef = useRef(null);
  const {fieldName, registerField , error , defaultValue} = useField(name)
  
  useEffect(() => {
    registerField({
      name : fieldName,
      ref: inputRef.current,
      path: 'value'
    })
  },[])
  
  return(
    <div className={styles.container}>
      {Icon && <Icon size={20}   /> }
      <input defaultValue={defaultValue} ref={inputRef} {...rest}  />
      <span className={styles.errorInfo} >{error}</span>
    </div>
  )
}