import { Component } from 'react'
import Modal from '@material-ui/core/Modal';
import NumberFormat from 'react-number-format';
import _ from 'lodash';

import menu from '../../../assets/images/menu-line-blue.png';
import dummy from '../../../assets/images/u_placeholder.jpg';
import cameraBlack from '../../../assets/images/camera-black.png';
import editIconBlue from '../../../assets/images/ic-edit-blue.png';
import profilePlaceholder from '../../../assets/images/ic-placeholder-detail.png';
import cancel from "../../../assets/images/ic-cancel.png";
import remove from "../../../assets/images/icon-close-1.png";
import addMedia from "../../../assets/images/add-image.png";
import editIconWhite from '../../../assets/images/ic-edit-white.png';
import eyeIconClose from '../../../assets/images/icon-eye-closed.png';
import eyeIconOpen from '../../../assets/images/icon-eye-open.png';


interface Props {
    tradieProfileViewData: any,
    tradieBasicDetailsData: any,
    getTradieProfileView: () => void,
    getTradieBasicDetails: () => void,
}

interface State {
    isToggleSidebar: boolean,
    profileModalClicked: boolean,
    areasOfSpecsModalClicked: boolean,
    aboutModalClicked: boolean,
    portfolioModalClicked: boolean,
    editJobModalClicked: boolean,
    jobDescModalClicked: boolean,
    passwordModalClicked: boolean,
    basicDetails: any,
}

export class PersonalInformation extends Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            isToggleSidebar: false,
            profileModalClicked: false,
            areasOfSpecsModalClicked: false,
            aboutModalClicked: false,
            portfolioModalClicked: false,
            editJobModalClicked: false,
            jobDescModalClicked: false,
            passwordModalClicked: false,
            basicDetails: {
                userType: 1,
                userId: '',
                fullName: '',
                mobileNumber: '',
                email: '',
                qualificationDoc: []
            }
        }
    }

    componentDidMount() {
        this.props.getTradieProfileView();
        this.props.getTradieBasicDetails();
    }

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        console.log(nextProps, "nextProps--------------", prevState, "prevState-------------");
        if (nextProps.tradieBasicDetailsData && !_.isEqual(nextProps.tradieBasicDetailsData, prevState.basicDetails)) {
            console.log('different basic detailsssssssssssssssss');
            return {
                basicDetails: nextProps.tradieBasicDetailsData
            }
        }
        return null;
    }

    toggleSidebar = () => this.setState({ isToggleSidebar: !this.state.isToggleSidebar });

    render() {
        let props: any = this.props;
        console.log(this.state, "state--------------", props, "props------------");
        let {
            profileModalClicked,
            areasOfSpecsModalClicked,
            aboutModalClicked,
            portfolioModalClicked,
            passwordModalClicked,
            basicDetails,
        } = this.state;

        let profileView: any = props.tradieProfileViewData;

        return (
            <div>
                <div className="flex_row">
                    <div className="flex_col_sm_4">
                        <div className="upload_profile_pic">
                            <figure className="user_img">
                                <img src={profileView?.userImage ? profileView?.userImage : dummy} alt="Profile-pic" />
                            </figure>
                            <label className="camera" htmlFor="upload_profile_pic">
                                <img src={cameraBlack} alt="camera" />
                            </label>
                            <input
                                type="file"
                                // accept="image/png,image/jpg,image/jpeg,.pdf, .doc, video/mp4, video/wmv, video/avi"
                                accept="image/png,image/jpg,image/jpeg"
                                style={{ display: "none" }}
                                id="upload_profile_pic"
                            />
                        </div>
                    </div>
                    <div className="flex_col_sm_8">
                        <span className="title">{profileView?.userName}
                            <span className="edit_icon" title="Edit" onClick={() => this.setState({ profileModalClicked: true })}>
                                <img src={editIconBlue} alt="edit" />
                            </span>
                        </span>
                        <span className="tagg">Tradie</span>
                        <ul className="review_job">
                            <li>
                                <span className="icon reviews">{profileView?.ratings || 0}</span>
                                <span className="review_count">{`${profileView?.reviewsCount || 0} reviews`}</span>
                            </li>
                            <li>
                                <span className="icon job">{profileView?.jobCompletedCount}</span>
                                <span className="review_count"> jobs completed</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Modal
                    className="custom_modal"
                    open={profileModalClicked}
                    onClose={() => this.setState({ profileModalClicked: false })}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className="custom_wh profile_modal" data-aos="zoom-in" data-aos-delay="30" data-aos-duration="1000">
                        <div className="heading">
                            <span className="sub_title">Edit Profile</span>
                            <button className="close_btn" onClick={() => this.setState({ profileModalClicked: false })}>
                                <img src={cancel} alt="cancel" />
                            </button>
                        </div>
                        <div className="inner_wrap">
                            <div className="inner_wrappr">
                                <div className="form_field">
                                    <label className="form_label">Full Name</label>
                                    <div className="text_field">
                                        <input type="text" placeholder="Enter Full Name" value={basicDetails.fullName} />
                                    </div>
                                </div>
                                <div className="form_field">
                                    <label className="form_label">Mobile Number</label>
                                    <div className="text_field">
                                        {/* <input type="number" placeholder="Enter Mobile Number" value={basicDetails.mobileNumber} /> */}

                                        <NumberFormat
                                            value={basicDetails.mobileNumber}
                                            displayType={'input'}
                                            type={'tel'}
                                            placeholder="+61 400 123 456"
                                            format="+61 ### ### ###"
                                            isNumericString={true}
                                            onValueChange={(values) => {
                                                const { formattedValue, value } = values;
                                                // formattedValue = $2,223
                                                // value ie, 2223
                                                // this.setState({ profit: formattedValue })
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="form_field">
                                    <label className="form_label">Email</label>
                                    <div className="text_field">
                                        <input type="text" placeholder="Enter Email" value={basicDetails.email} />
                                    </div>
                                </div>
                                <div className="form_field">
                                    <a className="link"
                                        onClick={() => this.setState({ passwordModalClicked: true, profileModalClicked: false })}
                                    >Change password</a>
                                </div>
                                <div className="form_field">
                                    <label className="form_label">Qualification documents </label>
                                </div>
                                <div className="form_field">
                                    <div className="relate">
                                        <div className="checkbox_wrap agree_check">
                                            <input name="qualification" className="filter-type filled-in" type="checkbox" id="doc1" />
                                            <label htmlFor="doc1" className="line-1">White Card</label>
                                        </div>
                                        <div className="edit_delete tr">
                                            <span className="edit" title="Edit"></span>
                                            <span className="remove" title="Remove"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form_field">
                                    <div className="relate">
                                        <div className="checkbox_wrap agree_check">
                                            <input name="qualification" className="filter-type filled-in" type="checkbox" id="doc2" />
                                            <label htmlFor="doc2" className="line-1">First Aid</label>
                                        </div>
                                        <div className="edit_delete tr">
                                            <span className="edit" title="Edit"></span>
                                            <span className="remove" title="Remove"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form_field">
                                <button className="fill_grey_btn full_btn btn-effect">Add qualification documents </button>
                            </div>
                            <span className="info_note">Don’t worry, nobody will see it. This is for verification only!</span>
                        </div>
                        <div className="bottom_btn custom_btn">
                            <button className="fill_btn full_btn btn-effect">Save changes</button>
                        </div>
                    </div>
                </Modal>

                <Modal
                    className="custom_modal"
                    open={passwordModalClicked}
                    onClose={() => this.setState({ passwordModalClicked: false })}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className="custom_wh profile_modal" data-aos="zoom-in" data-aos-delay="30" data-aos-duration="1000">
                        <div className="heading form_field">
                            <div className="relate">
                                <button className="back"></button>
                                <div className="md_heading">
                                    <span className="sub_title">Change password</span>
                                </div>
                            </div>
                            <button className="close_btn">
                                <img src={cancel} alt="cancel" />
                            </button>
                        </div>
                        <div className="inner_wrappr">
                            <div className="form_field">
                                <label className="form_label">Password</label>
                                <div className="text_field">
                                    <input type="password" className="detect_input" placeholder="Enter Password" />
                                    <span className="detect_icon">
                                        {/* <img src={showPassword ? eyeIconOpen : eyeIconClose} /> */}
                                        <img src={eyeIconClose} />
                                    </span>
                                </div>
                                <span className="error_msg"></span>
                            </div>
                            <div className="form_field">
                                <label className="form_label">New Password</label>
                                <div className="text_field">
                                    <input type="password" className="detect_input" placeholder="Enter New Password" />
                                    <span className="detect_icon">
                                        {/* <img src={showPassword ? eyeIconOpen : eyeIconClose} /> */}
                                        <img src={eyeIconClose} />
                                    </span>
                                </div>
                                <span className="error_msg"></span>
                            </div>
                            <div className="form_field">
                                <label className="form_label">Confirm New Password</label>
                                <div className="text_field">
                                    <input type="password" className="detect_input" placeholder="Enter Confirm New Password" />
                                    <span className="detect_icon">
                                        {/* <img src={showPassword ? eyeIconOpen : eyeIconClose} /> */}
                                        <img src={eyeIconClose} />
                                    </span>
                                </div>
                                <span className="error_msg"></span>
                            </div>
                        </div>
                        <div className="bottom_btn custom_btn">
                            <button className="fill_btn full_btn btn-effect">Save changes</button>
                        </div>
                    </div >
                </Modal >

                <div className="section_wrapper">
                    <span className="sub_title">Areas of specialisation
                                    <span className="edit_icon" title="Edit" onClick={() => this.setState({ areasOfSpecsModalClicked: true })}>
                            <img src={editIconBlue} alt="edit" />
                        </span>
                    </span>
                    <div className="tags_wrap">
                        <ul>
                            <li className="main">
                                <img src={profileView?.areasOfSpecialization?.tradeData[0]?.tradeSelectedUrl || menu} alt="icon" />{profileView?.areasOfSpecialization?.tradeData[0]?.tradeName}
                            </li>
                            <li>Electrical Instrumentation</li>
                            <li>Security and Fire Alarm Installation</li>
                            <li>Electrical Instrumentation</li>
                            <li>Security and Fire Alarm Installation</li>
                            <li>More</li>
                            {
                                profileView?.areasOfSpecialization?.specializationData?.map(({ specializationId, specializationName }: { specializationId: string, specializationName: string }) => {
                                    return <li key={specializationId}>{specializationName}</li>
                                })
                            }
                        </ul>
                    </div>
                </div>

                <Modal
                    className="custom_modal"
                    open={areasOfSpecsModalClicked}
                    onClose={() => this.setState({ areasOfSpecsModalClicked: false })}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className="custom_wh ask_ques">
                        Areas of specialisation
                    </div>
                </Modal>

                <div className="section_wrapper">
                    <span className="sub_title">About
                        <span className="edit_icon" title="Edit" onClick={() => this.setState({ aboutModalClicked: true })}>
                            <img src={editIconBlue} alt="edit" />
                        </span>
                    </span>
                    <button className="fill_grey_btn full_btn btn-effect">Add info about you</button>
                    {/* <p className="commn_para">** Currently on holiday, back Jan 10! ** Just finished up my Electricians apprenticeship working on large project sites around Melbourne. I aim to finish all my work in a timely and affordable manner. If that sounds good to you, flick me a message and I’ll reply ASAP! Just finished up my Electricians apprenticeship working on large project sites around Melbourne. I aim to finish all my work in a timely and affordable manner. Just finished up my Electricians apprenticeship working on large project sites around Melbourne.</p> */}
                    <p className="commn_para">{profileView?.about}</p>
                </div>

                <Modal
                    className="custom_modal"
                    open={aboutModalClicked}
                    onClose={() => this.setState({ aboutModalClicked: false })}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className="custom_wh profile_modal" data-aos="zoom-in" data-aos-delay="30" data-aos-duration="1000">
                        <div className="heading">
                            <span className="sub_title">About</span>
                            <button className="close_btn" onClick={() => this.setState({ aboutModalClicked: false })}>
                                <img src={cancel} alt="cancel" />
                            </button>
                        </div>
                        <div className="form_field">
                            <label className="form_label">Description</label>
                            <div className="text_field">
                                <textarea placeholder="Enter Description"></textarea>
                            </div>
                        </div>
                        <div className="bottom_btn custom_btn">
                            <button className="fill_btn full_btn btn-effect">Save changes</button>
                            <button className="fill_grey_btn btn-effect">Cancel</button>
                        </div>
                    </div>
                </Modal>

                <div className="section_wrapper">
                    <span className="sub_title">Portfolio
                        <span className="edit_icon" title="Edit" onClick={() => this.setState({ portfolioModalClicked: true })}>
                            <img src={editIconBlue} alt="edit" />
                        </span>
                    </span>
                    <button className="fill_grey_btn full_btn btn-effect">Add portfolio</button>
                    <ul className="portfolio_wrappr">
                        {/* jon name ismissing in portfolio */}
                        {
                            profileView?.portfolio?.map(({ jobDescription, portfolioId, portfolioImage }: { jobDescription: string, portfolioId: string, portfolioImage: Array<any> }) => {
                                return (
                                    <li className="media" key={portfolioId}>
                                        <figure className="portfolio_img">
                                            <img src={portfolioImage[0] ? portfolioImage[0] : profilePlaceholder} alt="portfolio-images" />
                                            <span className="xs_sub_title">{jobDescription}</span>
                                        </figure>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>

                <Modal
                    className="custom_modal"
                    open={portfolioModalClicked}
                    onClose={() => this.setState({ portfolioModalClicked: false })}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className="custom_wh profile_info" data-aos="zoom-in" data-aos-delay="30" data-aos-duration="1000">
                        <div className="heading">
                            <span className="sub_title">Portfolio</span>
                            <button className="close_btn">
                                <img src={cancel} alt="cancel" />
                            </button>
                        </div>
                        <div className="inner_wrap">
                            <ul className="portfolio_wrappr">
                                <li className="media">
                                    <figure className="portfolio_img">
                                        <img src={profilePlaceholder} alt="portfolio-images" />
                                        <span className="edit_icon">
                                            <img src={editIconWhite} alt="edit" />
                                        </span>
                                        <span className="xs_sub_title">Dummy text</span>
                                    </figure>
                                </li>
                                <li className="media">
                                    <figure className="portfolio_img">
                                        <img src={profilePlaceholder} alt="portfolio-images" />
                                        <span className="edit_icon">
                                            <img src={editIconWhite} alt="edit" />
                                        </span>
                                        <span className="xs_sub_title">Dummy text</span>
                                    </figure>
                                </li>
                            </ul>
                        </div>
                        <div className="bottom_btn custom_btn">
                            <button className="fill_btn full_btn btn-effect">Save changes</button>
                        </div>
                    </div>

                    {/* job detail edit */}
                    {/* <div className="custom_wh" data-aos="zoom-in" data-aos-delay="30" data-aos-duration="1000">
                                <div className="heading">
                                    <div className="relate">
                                        <button className="back"></button>
                                        <div className="md_heading">
                                            <span className="sub_title">Machine Maintenance</span>
                                            <span className="info_note">Tradies who have a portfolio with photos get job faster. </span>
                                        </div>
                                    </div>
                                    <button className="close_btn">
                                        <img src={cancel} alt="cancel" />
                                    </button>
                                </div>
                                <div className="inner_wrap">
                                    <div className="inner_wrappr">
                                        <div className="form_field">
                                            <label className="form_label">Job Name</label>
                                            <div className="text_field">
                                                <input type="text" placeholder="Enter Job Name" />
                                            </div>
                                        </div>
                                        <div className="form_field">
                                            <label className="form_label">Job Description</label>
                                            <div className="text_field">
                                                <textarea placeholder="The item has..."></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="upload_img_video">
                                        <figure className="img_video">
                                            <img src={dummy} alt="img" />
                                            <img src={remove} alt="remove" className="remove" />
                                        </figure>
                                        <label className="upload_media" htmlFor="upload_img_video">
                                            <img src={addMedia} alt="add" />
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/png,image/jpg,image/jpeg,.pdf, .doc, video/mp4, video/wmv, video/avi"
                                            style={{ display: "none" }}
                                            id="upload_img_video"
                                        />
                                    </div>
                                </div>
                                <div className="bottom_btn custom_btn">
                                    <button className="fill_btn full_btn btn-effect">Save changes</button>
                                    <button className="fill_grey_btn btn-effect">Cancel</button>
                                </div>
                            </div> */}
                    {/* job detail edit close */}

                </Modal>
                <div className="section_wrapper">
                    <button className="fill_btn full_btn btn-effect">Save changes</button>
                </div>
            </div >
        )
    }
}

export default PersonalInformation;
