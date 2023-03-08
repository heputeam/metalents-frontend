import Button from '@/components/Button';
import Toast from '@/components/Toast';
import React, { useState } from 'react';
import styles from './index.less';
import { Typography } from '@mui/material';
import { useRequest } from 'ahooks';
import moment from 'moment';
import { IListItemType } from '../ExperienceItem';
import Experience from '../Experience';
import classNames from 'classnames';
import { ExperienceType, IUpdateExperienceParams } from '@/service/user/types';
import { postUserUpdateExperience } from '@/service/user';

export type IExperenceInputBlockProps = {
  experiencePlaceholder: IListItemType;
  initialExperience: IListItemType[];
  setExperienceList: (value: IListItemType[]) => void;
  experienceList: IListItemType[];
  educationPlaceholder: IListItemType;
  initialEducation: IListItemType[];
  setEducationList: (value: IListItemType[]) => void;
  educationList: IListItemType[];
  modifyLeftTimes: { work: number; education: number };
  afterUpload?: () => void;
  canEdit: boolean;
};

const handleParams = (list: IListItemType[], type: ExperienceType) => {
  return list.map((item) => {
    return {
      description: item.description,
      endTime: item.end_time === 'Now' ? -1 : moment(item.end_time, 'Y').unix(),
      id: item.id > 0 ? item.id : 0,
      industry: item.industry,
      location: item.location,
      startTime: moment(item.start_time).unix(),
      type: type,
    };
  });
};

const ExperenceInputBlock: React.FC<IExperenceInputBlockProps> = ({
  experiencePlaceholder,
  setExperienceList,
  experienceList,
  initialExperience,
  educationPlaceholder,
  setEducationList,
  educationList,
  initialEducation,
  modifyLeftTimes,
  afterUpload,
  canEdit,
}) => {
  const canEditWork = !!modifyLeftTimes.work;
  const canEditEducation = !!modifyLeftTimes.education;

  const handlExperienceTypeAdd = () => {
    setExperienceList([
      ...experienceList,
      { ...experiencePlaceholder, id: -Date.now() },
    ]);
  };

  const handleEducationAdd = () => {
    setEducationList([
      ...educationList,
      { ...educationPlaceholder, id: -Date.now() },
    ]);
  };

  const { run: runUpdatExperienceType } = useRequest<
    any,
    [IUpdateExperienceParams]
  >((params) => postUserUpdateExperience(params), {
    manual: true,
    onSuccess: (data) => {
      const { code } = data;
      if (code === 200) {
        Toast.success('Successfully saved!');
        afterUpload?.();
      } else {
        Toast.error('Unknown system failure: Please try');
      }
    },
  });

  const isValid = (block: ExperienceType) => {
    switch (block) {
      case ExperienceType.WORK:
        return experienceList.every(
          (v) => v.industry && v.location && v.description,
        );

      case ExperienceType.EDUCATION:
        return educationList.every(
          (v) => v.industry && v.location && v.description,
        );

      default:
        break;
    }
  };

  const [isWorkEditing, setIsWorkEditing] = useState(false);
  const [isEducationEditing, setIsEducationEditing] = useState(false);

  const handleEditClick = (block: ExperienceType) => {
    switch (block) {
      case ExperienceType.WORK:
        setIsWorkEditing(true);
        break;

      case ExperienceType.EDUCATION:
        setIsEducationEditing(true);
        break;

      default:
        break;
    }
  };

  const checkValidYearLegal = (list: IListItemType[]) => {
    return list.every(
      (v) => moment(v.start_time).unix() <= moment(v.end_time).unix(),
    );
  };

  const checkValidYearFormat = (list: IListItemType[]) => {
    return list.every(
      (v) =>
        /^[12]\d{3}$/g.test(v.start_time) && /^[12]\d{3}$/g.test(v.end_time),
    );
  };

  const checkValidYearRequire = (list: IListItemType[]) => {
    return list.every((v) => v.start_time && v.end_time);
  };

  const handleSaveClick = (block: ExperienceType) => {
    switch (block) {
      case ExperienceType.WORK:
        if (!isValid(ExperienceType.WORK)) {
          return Toast.error(`Required fields can't be blank`);
        }
        if (!checkValidYearRequire(experienceList)) {
          return Toast.error(`The starting and ending time can't be blank.`);
        }
        if (!checkValidYearFormat(experienceList)) {
          return Toast.error(
            `The starting and ending time must be the year number.`,
          );
        }
        if (!checkValidYearLegal(experienceList)) {
          return Toast.error(
            'Incorrect date. Start time should be earlier than the end time.',
          );
        }
        const _experienceList = handleParams(
          experienceList,
          ExperienceType.WORK,
        );
        const _initialEducation = handleParams(
          initialEducation,
          ExperienceType.EDUCATION,
        );
        const workParams = {
          experience: [..._initialEducation, ..._experienceList],
        };
        console.log('save work params: ', workParams);
        runUpdatExperienceType(workParams);
        setIsWorkEditing(false);
        break;

      case ExperienceType.EDUCATION:
        if (!isValid(ExperienceType.EDUCATION)) {
          return Toast.error(`Required fields can't be blank`);
        }
        if (!checkValidYearRequire(educationList)) {
          return Toast.error(`The starting and ending time can't be blank.`);
        }
        if (!checkValidYearFormat(educationList)) {
          return Toast.error(
            `The starting and ending time must be the year number.`,
          );
        }
        if (!checkValidYearLegal(educationList)) {
          return Toast.error(
            'Incorrect date. Start time should be earlier than the end time.',
          );
        }

        const _educationList = handleParams(
          educationList,
          ExperienceType.EDUCATION,
        );
        const _initialExperience = handleParams(
          initialExperience,
          ExperienceType.WORK,
        );
        const educationParams = {
          experience: [..._initialExperience, ..._educationList],
        };
        console.log('save education params: ', educationParams);
        runUpdatExperienceType(educationParams);

        setIsEducationEditing(false);
        break;

      default:
        break;
    }
  };

  return (
    <div className={styles['step2-wrap']}>
      <div className={styles['experience-box']}>
        {canEdit && (
          <>
            {isWorkEditing && (
              <div className={styles['cancel-box']}>
                <Button
                  variant="outlined"
                  rounded
                  style={{ width: '109px' }}
                  onClick={() => setIsWorkEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
            <div className={styles['action-box']}>
              <Button
                variant="contained"
                rounded
                classes={{ disabled: styles['btn-disabled'] }}
                style={{ width: '109px' }}
                onClick={() => {
                  if (isWorkEditing) {
                    handleSaveClick(ExperienceType.WORK);
                  } else {
                    handleEditClick(ExperienceType.WORK);
                  }
                }}
                disabled={!canEditWork}
              >
                <Typography variant="body2">
                  {isWorkEditing ? `Save` : 'Edit'}
                </Typography>
              </Button>

              <Typography
                variant="body2"
                className={classNames(
                  styles['modification-left-times'],
                  !canEditWork && styles['modification-left-times-disabled'],
                )}
              >
                {`${modifyLeftTimes.work} modification left`}
              </Typography>
            </div>
          </>
        )}
        <Typography variant="h2" className={styles['title']}>
          Experience
        </Typography>

        <Experience
          list={experienceList}
          edit={isWorkEditing}
          setList={setExperienceList}
          onAdd={handlExperienceTypeAdd}
        />
      </div>

      <div className={styles['education-box']}>
        {canEdit && (
          <>
            {isEducationEditing && (
              <div className={styles['cancel-box']}>
                <Button
                  variant="outlined"
                  rounded
                  style={{ width: '109px' }}
                  onClick={() => setIsEducationEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
            <div className={styles['action-box']}>
              <Button
                variant="contained"
                rounded
                style={{ width: '109px' }}
                classes={{ disabled: styles['btn-disabled'] }}
                onClick={() => {
                  if (isEducationEditing) {
                    handleSaveClick(ExperienceType.EDUCATION);
                  } else {
                    handleEditClick(ExperienceType.EDUCATION);
                  }
                }}
                disabled={!canEditEducation}
              >
                <Typography variant="body2">
                  {isEducationEditing ? `Save` : 'Edit'}
                </Typography>
              </Button>

              <Typography
                variant="body2"
                className={classNames(
                  styles['modification-left-times'],
                  !canEditEducation &&
                    styles['modification-left-times-disabled'],
                )}
              >
                {`${modifyLeftTimes.education} modification left`}
              </Typography>
            </div>
          </>
        )}

        <Typography variant="h2" className={styles['title']}>
          Education
        </Typography>

        <Experience
          type={2}
          list={educationList}
          setList={setEducationList}
          edit={isEducationEditing}
          onAdd={handleEducationAdd}
        />
      </div>
    </div>
  );
};

export default ExperenceInputBlock;
