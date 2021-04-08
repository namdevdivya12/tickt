import React from 'react';
import colorLogo from '../../../assets/images/ic-logo-yellow.png';
import menu from '../../../assets/images/menu-line-white.svg';
import bell from '../../../assets/images/ic-notification.png';
import dummy from '../../../assets/images/u_placeholder.jpg';

const JobMilestones = () => {
    return (
        <div className="app_wrapper">

            {/* Header */}
            <header id="header">
                <div className="custom_container">
                    <div className="flex_headrow">
                        <div className="brand_wrap">
                            <figure>
                                <img src={colorLogo}
                                    alt="logo-white" />
                            </figure>
                        </div>
                        <ul className="center_nav">
                            <li>
                                <a>Discover</a>
                            </li>
                            <li>
                                <a>Jobs</a>
                            </li>
                            <li>
                                <a className="active">Post</a>
                            </li>
                            <li>
                                <a>Chat</a>
                            </li>
                        </ul>


                        <ul className="side_nav">
                            <li className="mob_nav">
                                <img src={menu} alt="menu" />
                            </li>
                            <div className="profile_notification">
                                <div className="notification_bell">
                                    <figure className="bell">
                                        <span className="badge">4 </span>
                                        <img src={bell} alt="notify" />
                                    </figure>
                                </div>
                                <div className="user_profile">
                                    <figure aria-controls="simple-menu" aria-haspopup="true">
                                        <img src={dummy} alt="profile-img" />
                                    </figure>
                                </div>
                            </div>
                        </ul>
                    </div>

                </div>
            </header>
            {/* Header close */}

            <div className="section_wrapper">
                <div className="custom_container">
                    <div className="form_field">
                        <div className="flex_row f_reverse">
                            <div className="flex_col_sm_5">
                                <div className="relate">
                                    <button className="back"></button>
                                    <span className="title">Job milestones</span>
                                </div>
                            </div>
                            <div className="flex_col_sm_7 text-right">
                                <a href="javascript:void(0)" className="link">Save as template</a>
                                </div>
                        </div>
                    </div>
                    <div className="flex_row">
                        <div className="flex_col_sm_5">
                            <ul className="milestones">
                                <li>
                                    <div className="edit_delete">
                                        <span className="edit"></span>
                                        <span className="delete"></span>
                                    </div>
                                    <div className="checkbox_wrap agree_check">
                                        <input className="filter-type filled-in" type="checkbox" id="milestone" />
                                        <label htmlFor="milestone">Electrician’s certificate created</label>
                                        <div className="info">
                                            <span>Photo evidence required</span>
                                            <span>May 24 - 26</span>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="checkbox_wrap agree_check">
                                        <input className="filter-type filled-in" type="checkbox" id="milestone" />
                                        <label htmlFor="milestone">Electrician’s certificate created</label>
                                        <div className="info">
                                            <span>Photo evidence required</span>
                                            <span>May 24 - 26</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div className="form_field">
                                <button className="fill_btn fill_grey_btn full_btn">+ Add milestone</button>
                            </div>
                            <div className="form_field">
                                <button className="fill_btn full_btn">Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default JobMilestones
