//Dependencies
import React, { Component , PropTypes} from 'react';
import NotificationList from './notification-list';
import {capitalize} from 'lodash/string';
import {groupBy, reduce, pluck} from 'lodash/collection';
import {getConfig} from '../config';
import moment from 'moment';
const propTypes = {
    data: PropTypes.array,
    onSingleRead: PropTypes.func.isRequired,
    onGroupRead: PropTypes.func.isRequired,
    onSingleClick: PropTypes.func.isRequired
};
function _isYoungerThanA(periodName, date) {
    return moment(date).diff(moment().subtract(1, periodName)) > 0;
}
// function to group date
function groupDate({creationDate: date}) {
    const root = 'focus.notifications.groups';
    if(_isYoungerThanA('day', date)) {
        return `${root}.0_today`;
    }
    if(_isYoungerThanA('week', date)) {
        return `${root}.1_lastWeek`;
    }
    if(_isYoungerThanA('month', date)) {
        return `${root}.2_lastMonth`;
    }
    return `${root}.3_before`;
}

function translate(key){
    const {translateText} = getConfig();
    return translateText(key);
}

function sortDateFn(a, b){
    return new Date(b.creationDate) - new Date(a.creationDate);
}

function sortNameFn(a,b){
    if (a.key < b.key)
    return -1;
    else if (a.key > b.key)
    return 1;
    else
    return 0;
}

//Maybe i should add a Notification Group component by date which uses a notifciation list component
const NotificationGroup = ({data, onGroupRead, onSingleRead, onSingleClick}) => {
    //    console.log('Grouped infos', groupBy(data, groupDate), reduce(groupBy(data, groupDate));
    const groupedAndSortedNotifs = reduce(
        groupBy(data, groupDate),
        (accumulator, value, key) => {
            accumulator.push({key, value});
            return accumulator;
        },
        []
    ).sort(sortNameFn);
    return (
        <div data-focus='notification-group'>
            {
                groupedAndSortedNotifs.map(
                    ({value: group, key: groupTitle}) => {
                        return (
                            <div key={groupTitle}>
                                <div data-focus='notification-group--title'>
                                    <h2>{`${translate(groupTitle)} (${group.length})`}</h2>
                                    <button className='mdl-button mdl-js-button mdl-button--icon' onClick={()=> onGroupRead(pluck(group, 'uuid'))}><i className='material-icons'>done_all</i></button>
                                </div>
                                <NotificationList data={group.sort(sortDateFn)} onRead={onSingleRead} onClick={onSingleClick}/>
                            </div>
                        );
                    }
                )
            }
        </div>
    );
};

NotificationGroup.propTypes = propTypes;

export default NotificationGroup;
