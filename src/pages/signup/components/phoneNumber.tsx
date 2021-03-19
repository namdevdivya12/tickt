import React, { useState, useEffect } from 'react';
import colorLogo from '../../../assets/images/ic-logo-yellow.png';
import SliderComponent from '../../../common/slider-component';
import { checkMobileNumber } from '../../../redux/auth/actions';
import Messages from '../../../common/Messages';
import globalRegex from '../../../common/globalRegex'
interface Propstype {
    updateSteps: (num: number) => void
    step: number
    history?: any
    signupSteptwo: (data: any, step: number) => void,
}

const PhoneNumber = (props: Propstype) => {
    const [errors, setErrors] = useState<any>({});
    const [mobileNumber, setMobileNumber] = useState<any>('')

    useEffect(() => {
        const prevUserSignupData: any = JSON.parse(sessionStorage.getItem('userSignupData')!)
        if (prevUserSignupData) {
            console.log(prevUserSignupData.mobileNumber, 'prevUserSignupData   effect')
            setMobileNumber(prevUserSignupData.mobileNumber)
        }
    }, [])

    const backButtonHandler = () => {
        props.updateSteps(props.step - 1)
    }

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMobileNumber(e.target.value)
    }

    const validateForm = () => {
        const newErrors: any = {};
        if (!mobileNumber) {
            newErrors.mobileNumber = Messages.phoneNumberEmpty;
        } else {
            const nameRegex = new RegExp(globalRegex.regex.mobile);
            if (!nameRegex.test(mobileNumber)) {
                newErrors.mobileNumber = Messages.phoneNumberErr
            }
            // else if (nameRegex.test(mobileNumber) && mobileNumber.length > 50) {
            //     newErrors.mobileNumber = Messages.fullNameLengthErr
            // }
        }
        console.log(newErrors)
        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('ok 68')
            const res: any = await checkMobileNumber(mobileNumber)
            if (res.success && res.message === 'This Mobile Number is Unique') {
                props.signupSteptwo(mobileNumber, props.step + 1)
            } else if (res.success && res.message === 'This Mobile Number is already in use') {
                let newErrors: any = {}
                newErrors.email = Messages.phoneNumberExist
                setErrors(newErrors)
            } else {
                alert('something went wrong. Please try later!')
            }
        }
    }

    return (
        <div className="onboard_wrapper">
            <div className="f_row">
                <div className="left_col">
                    <SliderComponent />
                </div>
                <div className="right_col">
                    <figure className="mob_logo hide">
                        <img src={colorLogo} alt="Tickt-logo" />
                    </figure>
                    <div className="onboarding_head">
                        <button className="back_btn" onClick={backButtonHandler}/>
                        <h1>Phone number </h1>
                        <ul className="custom_steppr">
                            <li className="active"></li>
                            <li className="active"></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                    <div className="form_wrapper">
                        <form onSubmit={onSubmit}>
                            <div className="form_field">
                                <label className="form_label">Phone number</label>
                                <div className="text_field">
                                    <input type="text" placeholder="Enter your Phone number" value={mobileNumber} onChange={changeHandler} />
                                </div>
                                {!!errors.mobileNumber &&<span className="error_msg">{errors.mobileNumber}</span>}
                            </div>

                            <div className="form_field">
                                <button className="fill_btn">Next</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PhoneNumber

