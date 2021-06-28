import React, { useState, useEffect } from 'react'
// @ts-ignore
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { renderTime, renderTimeWithCustomFormat } from '../../../../utils/common';
import milestonesPlaceholder from '../../../../assets/images/Job milestones-preview.png';
import moment from 'moment';
import { setShowToast } from '../../../../redux/common/actions';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { changeRequest } from '../../../../redux/jobs/actions';

import AddEditMile from './addEditMile';

import { withRouter } from 'react-router-dom';

const EditMilestone = (props: any) => {
    const { item, item: { jobId, jobName }, details: { milestones }, history } = props;

    const propsMile = Object.freeze(props?.details?.milestones);
    const [stateData, setStateData] = useState<any>([]);
    const [editItem, setEditItems] = useState<{ [index: string]: any }>({});
    const [open, setOpen] = React.useState(false);
    const [deleteItem, setDeleteItem] = React.useState(null);

    const [itemData, setItemData] = useState({ add: false, edit: false, editId: '', deleteId: '' });

    const [sortedItems, setSortedItems] = React.useState([]);

    const [toggleItem, setToggleItem] = useState(false);

    useEffect(() => {
        console.log({ milestones })
        if (!stateData?.length) {
            setStateData(milestones);
        }
    }, [props])

    const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        // dropped outside the list
        if (!destination) {
            return;
        }

        // if (source.droppableId === destination.droppableId) {
        const reOrderItems = reorder(
            stateData,
            source.index,
            destination.index
        );
        setStateData(reOrderItems)
    };

    const checkIfValidDates = (item: any) => {
        console.log({ stateData })
        let isfilter = stateData.filter((item_: any) => {
            if (item_.hasOwnProperty('fromDate')) {
                if (moment(item_?.fromDate).isValid()) {
                    return item_;
                }
            }
        });
        console.log({ isfilter })
        if (!isfilter?.length) {
            return true;
        } else {
            const newarr: any = isfilter.slice().sort((a: any, b: any) => {
                return moment(a.fromDate).diff(moment(b.fromDate));
            });
            let filteredItem: any = item.filter((item_reorder: any) => {
                if (item_reorder.hasOwnProperty('fromDate')) {
                    if (moment(item_reorder?.fromDate).isValid()) {
                        return item_reorder;
                    }
                }
            });
            setSortedItems(newarr);
            console.log({
                newarr,
                filteredItem
            })
            return JSON.stringify(newarr) === JSON.stringify(filteredItem);
        }
    }


    const checkIfDatesValid = () => {
        let data = item;
        console.log({ data, stateData }, '----->');
        let start_selection: any = data?.fromDate;
        let end_selection: any = null;
        if (moment(data?.toDate).isValid()) {
            if (!moment(data?.toDate).isSame(moment(data?.fromDate))) {
                end_selection = data?.toDate;
            }
        }

        let item_find: any = false;
        let filteredItem = stateData.filter((item: any) => {
            if (item.hasOwnProperty('fromDate')) {
                if (moment(item?.fromDate).isValid()) {
                    return item;
                }
            }
        });

        if (filteredItem?.length) {
            filteredItem.forEach((item_date: any) => {
                let start: any = moment(item_date.fromDate).isValid() ? item_date.fromDate : null;
                let end: any = moment(item_date.toDate).isValid() ? item_date.toDate : null;

                if (start && end) {
                    if (start_selection && end_selection) {
                        if (moment(start_selection).isAfter(moment(start)) || moment(end_selection).isBefore(moment(end))) {
                            item_find = true
                        }
                    }
                }

                if (start && !end) {
                    if (moment(start_selection).isAfter(moment(start))) {
                        item_find = true; // true;
                    }
                }

                if (start_selection && end_selection && !end) {
                    if (moment(start).isSameOrAfter(moment(start_selection)) && moment(start).isSameOrBefore(moment(end_selection))) {
                        item_find = false;
                    } else {
                        item_find = true
                    }
                }
            });
        }

        if (item_find) {
            setShowToast(true, 'Please check the milestone dates.');
            return item_find;
        }

        return item_find;
    }

    const checkOnClick = (e: any, index: any) => {
        let edit_item_clone: any = editItem;
        edit_item_clone[index] = e.target.checked;
        setEditItems((prev) => ({ ...prev, ...edit_item_clone }));
    }

    const resetItems = () => {
        setItemData((prev: any) => ({ ...prev, add: false, edit: false, editId: '', deleteId: '' }));
        setEditItems({});
    }

    const addNewMile = (item: any) => {
        let state_data: any = stateData;
        if (itemData.edit) { // edit
            let index = parseInt(itemData.editId);

            state_data[itemData.editId]['isPhotoevidence'] = item.isPhotoevidence;
            state_data[itemData.editId]['milestoneName'] = item.milestoneName;
            state_data[itemData.editId]['recommendedHours'] = item.recommendedHours;

            state_data[index]['fromDate'] = moment(item.fromDate).isValid() ? moment(item.fromDate).toISOString() : '';
            state_data[index]['toDate'] = moment(item.toDate).isValid() ? moment(item.toDate).toISOString() : '';
            setStateData(state_data)

        } else {
            setStateData((prev: any) => ([...prev, item]));
        }
    }

    if (itemData?.add || itemData?.edit) {
        return (
            <AddEditMile
                item={item}
                milestones={stateData}
                editMile={itemData.editId}
                addNewMile={addNewMile}
                resetItems={resetItems}
            />
        )
    }

    const removeMilestoneByIndex = (index: any) => {
        setStateData(stateData.filter((_: any, index_: any) => index_ !== index));
        resetItems();
    }

    const checkIfChange = () => {
        // if (JSON.stringify(stateData) !== JSON.stringify(props?.details?.milestones)) {
        if (JSON.stringify(propsMile) == JSON.stringify(stateData)) {
            return true;
        }
        return false;
    }

    const submitData = () => {
        let filtered = stateData.map((item: any) => {
            let data = {
                "milestoneId": item?.milestoneId || '',
                "milestone_name": item?.milestoneName,
                "isPhotoevidence": item?.isPhotoevidence,
                "from_date": moment(item?.fromDate).format("YYYY-MM-DD"),
                "to_date": moment(item?.toDate).isValid() ? moment(item?.toDate).format("YYYY-MM-DD") : '',
                "recommended_hours": item?.recommendedHours
            }

            if (!item?.milestoneId) {
                delete data.milestoneId;
            }

            return data;
        })


        let data = {
            "jobId": item.jobId,
            "tradieId": item.tradeId,
            "milestones": filtered
        };
        let response: any = changeRequest(data);
        if (response?.success) {
            props.history.push('/milestone-request-sent-success');
        }
    }
    console.log({ stateData })
    return (
        <React.Fragment>

            <Dialog
                open={toggleItem}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'If you click the back arrow, you lose the data, do you want to save it ?'}
                </DialogTitle>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setToggleItem((prev: any) => !prev);
                        }}
                        color="primary">
                        {'Yes'}
                    </Button>
                    <Button
                        onClick={() => {
                            setToggleItem((prev: any) => !prev);
                            props.backTab('edit');
                        }}
                        color="primary" autoFocus>
                        {'No'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={itemData?.deleteId !== '' ? true : false}
                onClose={resetItems}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to delete the milestone ?"}
                </DialogTitle>
                <DialogActions>
                    <Button
                        onClick={() => {
                            removeMilestoneByIndex(itemData?.deleteId);
                        }}
                        color="primary" autoFocus>
                        {'Yes'}
                    </Button>
                    <Button
                        onClick={() => {
                            resetItems()
                        }}
                        color="primary">
                        {'No'}
                    </Button>
                </DialogActions>
            </Dialog>

            <div className="flex_row">
                <div className="flex_col_sm_8">
                    <div className="relate">
                        <button
                            onClick={() => {
                                if (checkIfChange()) {
                                    setToggleItem((prev: any) => !prev);
                                    return
                                }
                                props.backTab('edit');
                            }}
                            className="back"></button>
                        <span className="xs_sub_title">
                            {jobName || ''}
                        </span>
                    </div>
                    <span className="sub_title">
                        {'Change Request'}
                    </span>
                    <p className="commn_para">
                        {'You can add/remove/change a milestones here. The changes will be sent to the tradesperson to accept before being implemented'}
                    </p>
                </div>
            </div>

            <div className="flex_row">
                <div className="flex_col_sm_7">
                    {console.log({ stateData })}
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="milestones">
                            {(provided, snapshot) => (
                                <ul ref={provided.innerRef}
                                    className={`milestones${snapshot.isDraggingOver ? ' dragging-over' : ''}`}>
                                    {stateData?.length > 0 &&
                                        stateData.map(({
                                            milestoneName,
                                            isPhotoevidence,
                                            recommendedHours,
                                            fromDate,
                                            toDate,
                                            status
                                        }: {
                                            milestoneName: string,
                                            isPhotoevidence: boolean,
                                            fromDate: string,
                                            toDate: string,
                                            status: number
                                            recommendedHours: any
                                        }, index: any) => (
                                            <Draggable
                                                key={`${index}-${milestoneName}`}
                                                draggableId={`${milestoneName}-${index}`}
                                                index={index}
                                                isDragDisabled={(status === 1 || status === 2) ? true : false}
                                            >
                                                {(provided: any, snapshot: any) => (
                                                    <li
                                                        key={index}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                        }}>
                                                        {editItem[index] ? (
                                                            <div className="edit_delete">
                                                                <span
                                                                    onClick={(e) => {
                                                                        setItemData((prev: any) => ({
                                                                            ...prev,
                                                                            edit: true,
                                                                            editId: index,
                                                                            deleteId: ''
                                                                        }));
                                                                    }}
                                                                    className="edit">
                                                                </span>
                                                                <span
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setItemData((prev: any) => ({
                                                                            ...prev,
                                                                            editId: '',
                                                                            deleteId: index
                                                                        }));
                                                                    }}
                                                                    className="delete"></span>
                                                            </div>
                                                        ) : ''}
                                                        <div className="checkbox_wrap agree_check">
                                                            <input
                                                                checked={editItem[index]}
                                                                onChange={(e: any) => {

                                                                    if (status !== 1 && status !== 2) {
                                                                        checkOnClick(e, index)
                                                                    }
                                                                }}
                                                                className="filter-type filled-in"
                                                                type="checkbox"
                                                                id={`milestone${index}`} />
                                                            <label htmlFor={`milestone${index}`}>{`${index + 1}. ${milestoneName}`}</label>
                                                            <div className="info">
                                                                {isPhotoevidence ?
                                                                    <span>{'Photo evidence required'}</span>
                                                                    : <span></span>}
                                                                <span>
                                                                    {renderTimeWithCustomFormat(
                                                                        fromDate,
                                                                        toDate,
                                                                        '',
                                                                        ['DD MMM', 'DD MMM YY']
                                                                    )}
                                                                </span>
                                                                <span>
                                                                    {recommendedHours}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                    {stateData?.length === 0 && (
                                        <figure className="placeholder_img">
                                            <img
                                                src={milestonesPlaceholder}
                                                alt="milestones-placeholder"
                                            />
                                        </figure>
                                    )}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                    {!stateData?.length ? (
                        <>
                            <div className="form_field">
                                <button
                                    className="fill_btn full_btn btn-effect"
                                    onClick={() => {
                                        setItemData({ add: true, editId: '', edit: false, deleteId: '' });
                                        // handleStepComplete({})
                                    }}>
                                    {'+ Add milestone'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <React.Fragment>
                            <div className="form_field">
                                <button className="fill_btn fill_grey_btn full_btn btn-effect"
                                    onClick={() => {
                                        setItemData({ add: true, editId: '', edit: false, deleteId: '' });
                                        // handleStepComplete({})
                                    }}>
                                    {'+ Add milestone'}
                                </button>
                            </div>

                            <div className="form_field">
                                <button
                                    onClick={() => {
                                        let checkIfItem: boolean = checkIfDatesValid();
                                        console.log({ checkIfItem })
                                        if (!checkIfItem) {
                                            let check: boolean = checkIfValidDates(stateData);
                                            console.log({ check })
                                            if (check) {
                                                submitData()
                                            } else {
                                                setShowToast(true, "Please arrange milestonea date wise.")
                                            }
                                        }
                                    }}
                                    className={`fill_btn full_btn btn-effect`}>
                                    {/* className={`fill_btn full_btn btn-effect ${checkIfChange() ? 'disable_btn' : ''}`}> */}
                                    {'Send to tradie'}
                                </button>
                            </div>
                        </React.Fragment>
                    )}

                </div>
            </div>
        </React.Fragment >

    )
}

export default withRouter(EditMilestone);