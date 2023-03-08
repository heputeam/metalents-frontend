import {
  FormControl,
  FormHelperText,
  OutlinedInput,
  Stack,
} from '@mui/material';
import React from 'react';
import styles from './index.less';
import TwitterSVG from '@/assets/imgs/account/profile/twitter.svg';
import InstagramSVG from '@/assets/imgs/account/profile/instagram.svg';
import WebsiteSVG from '@/assets/imgs/account/profile/website.svg';

export type ISocialFormItemProps = {
  formik: any;
};

const SocialFormItem: React.FC<ISocialFormItemProps> = ({ formik }) => {
  return (
    <div>
      <label className={styles['form-label']}>Social media links</label>

      <Stack direction="column" spacing={7}>
        <div className={styles['form-item']}>
          <img src={TwitterSVG} className={styles['icon']} alt="twitter" />

          <FormControl
            className={styles['social-form-control']}
            error={
              !!formik.touched['twitterLink'] && !!formik.errors['twitterLink']
            }
          >
            <OutlinedInput
              name={'twitterLink'}
              className={styles['input']}
              id="twitter-input"
              value={formik.values.twitterLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your Twitter...https://twitter.com..."
            />
            <FormHelperText
              id="twitter-helper-text"
              className={styles['helper-text']}
            >
              {formik.touched['twitterLink'] && formik.errors['twitterLink']}
            </FormHelperText>
          </FormControl>
        </div>

        <div className={styles['form-item']}>
          <img src={InstagramSVG} className={styles['icon']} alt="instagram" />

          <FormControl
            className={styles['social-form-control']}
            error={
              !!formik.touched['instagramLink'] &&
              !!formik.errors['instagramLink']
            }
          >
            <OutlinedInput
              name={'instagramLink'}
              className={styles['input']}
              id="website-input"
              value={formik.values.instagramLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your Instagram...https://www.instagram.com..."
            />
            <FormHelperText
              id="instagram-helper-text"
              className={styles['helper-text']}
            >
              {formik.touched['instagramLink'] &&
                formik.errors['instagramLink']}
            </FormHelperText>
          </FormControl>
        </div>

        <div className={styles['form-item']}>
          <img src={WebsiteSVG} className={styles['icon']} alt="website" />

          <FormControl
            className={styles['social-form-control']}
            error={!!formik.touched['website'] && !!formik.errors['website']}
          >
            <OutlinedInput
              name={'website'}
              className={styles['input']}
              id="website-input"
              value={formik.values.website}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your website...https://"
            />
            <FormHelperText
              id="website-helper-text"
              className={styles['helper-text']}
            >
              {formik.touched['website'] && formik.errors['website']}
            </FormHelperText>
          </FormControl>
        </div>
      </Stack>
    </div>
  );
};

export default SocialFormItem;
