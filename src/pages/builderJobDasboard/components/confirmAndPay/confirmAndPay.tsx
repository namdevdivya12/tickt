import React, { useState } from 'react';
import cardIcon from '../../../../assets/images/ic-credit.png';
import check from '../../../../assets/images/checked-2.png';

import PaymentDetails from './paymentDetails';
import Success from './suceess';
import { withRouter } from 'react-router-dom';

import dotMenu from '../../../../assets/images/menu-dot.png'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';



const ConfirmAndPay = (props: any) => {
    const [toggle, setToggle] = useState(false);
    const [selected, setSelected] = useState('0');
    const [editItem, setEditItem] = useState('');
    const [deleteToggle, setDeleteToggle] = useState(false);
    const [paymentDetail, setPaymentDetail] = useState<any>([
        {
            number: '371449635398431',
            cardholderName: 'Sam william',
            date: '07/22',
            cvv: '124'
        }
    ]);

    const backToScreen = () => {
        setToggle(false);
    }

    const setDetials = (data: any) => {
        if (data?.index) {
            paymentDetail[data?.index] = data;
        } else {
            setPaymentDetail((prev: any) => ([...prev, data]))
        }
    }

    if (toggle) {
        return (
            <PaymentDetails
                editItem={editItem}
                backToScreen={backToScreen}
                setDetials={setDetials}
                onSubmitAccept={props.onSubmitAccept}
            />
        )
    }

    return (
        <div className="flex_row">
            <div className="flex_col_sm_8">
                <div className="relate">
                    <button
                        onClick={() => {
                            props.backToScreen()
                        }}
                        className="back"></button>
                    <span className="xs_sub_title">
                        {'Wire up circuit box'}
                    </span>

                    <Dialog
                        open={deleteToggle}
                        onClose={() => {
                            setDeleteToggle((prev: any) => !prev)
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Are you sure you want to delete ?"}
                        </DialogTitle>
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    paymentDetail.splice(selected, 1);
                                    setPaymentDetail(paymentDetail);
                                    setDeleteToggle((prev: any) => !prev)
                                }}
                                color="primary" autoFocus>
                                {'Yes'}
                            </Button>
                            <Button
                                onClick={() => {
                                    setDeleteToggle((prev: any) => !prev)
                                }}
                                color="primary">
                                {'No'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <span className="dot_menu">
                        <img src={dotMenu} alt="edit" />
                        <div className="edit_menu">
                            <ul>
                                <li
                                    onClick={() => {
                                        try {
                                            console.log({
                                                paymentDetail,
                                                selected
                                            })
                                            let item = paymentDetail.find((_: any, index: any) => {
                                                console.log({_, index})
                                                if(index == selected){
                                                    return _;
                                                }
                                            });
                                            item['index'] = selected;
                                            setEditItem(item);
                                            setToggle(true);
                                        } catch (err) {
                                            console.log(err);
                                        }
                                    }}
                                    className="icon lodge">Edit</li>
                                <li
                                    onClick={() => {
                                        setDeleteToggle((prev: any) => !prev)
                                    }}
                                    className="icon delete">Delete</li>
                            </ul>
                        </div>
                    </span>
                </div>
                <div className="form_field">
                    <span className="sub_title">
                        {'Confirm and pay'}
                    </span>
                </div>
                <div className="mb130">
                    {paymentDetail?.length ?
                        paymentDetail.map((item: any, index: any) => (
                            <button
                                onClick={() => {
                                    setSelected(index);
                                }}
                                className="card_btn full_btn">
                                <img src={cardIcon} alt="card-icon" className="pos card" />
                                {/* {item?.cardholderName} */}
                                {'Credit Card'}{' '}
                                <span className="show_label">
                                    XXXX {(item?.number).substring(item?.number?.length - 4, item?.number?.length)}
                                </span>
                                {selected == index ? (
                                    <img src={check} alt="check" className="pos check" />
                                ) : null}
                            </button>
                        ))
                        : null}
                    {/* <button className="card_btn full_btn">
                        <img src={cardIcon} alt="card-icon" className="pos card" />
                        Credit Card <span className="show_label"> XXXX 4034</span>

                        <div className="checkbox_wrap agree_check pos check">
                            <input name="Select" className="filter-type filled-in" type="checkbox" id="select1" />
                            <label htmlFor="select1"></label>
                        </div>

                    </button> */}



                    <button
                        onClick={() => {
                            setToggle(true);
                        }}
                        className="fill_grey_btn full_btn btn-effect">
                        {paymentDetail?.length ? 'Add another card' : 'Add card'}
                    </button>
                </div>

                <div className="form_field">
                    <span className="payment_note">
                        Tickt does not store your payment information.
                    </span>
                    <p className="commn_para">
                        Tickt does not handle payment for jobs, we only facilitate
                        communication between tradies and builders. If you have problems
                        receiving your payment, please contact your builder.
                    </p>
                </div>
                <button
                    onClick={() => {
                        // this will submit the accept request.
                        props.onSubmitAccept();
                    }}
                    className={`fill_btn full_btn btn-effect ${!paymentDetail?.length ? 'disable_btn' : ''}`}>
                    {'Continue'}
                </button>
            </div>
        </div>
    )
}

export default withRouter(ConfirmAndPay);