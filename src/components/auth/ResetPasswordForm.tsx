import React, { useState } from "react"
import { useTranslation } from 'next-i18next'
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ResetPasswordForm: React.FC<{
	loading: boolean,
	onSubmit: (email: string) => void
}> = ({
	loading,
	onSubmit
}) => {

	const { t } = useTranslation('common')

	const formik = useFormik({
		initialValues: {
			password: '',
			confirm: '',
		},
		validationSchema: Yup.object({
			password: Yup.string().required(t('required')).min(6).max(50),
			confirm: Yup.string().required(t('required')).min(6).max(50),
		}),
		onSubmit: async (values) => {
			onSubmit(values.password)
		},
	});

	return (
		<form className="w-full" onSubmit={formik.handleSubmit}>
			<div className="form-control w-full mt-4">
				<input
					name="password"
					type="password"
					className={`input input-bordered w-full bg-transparent ${formik.touched.password && formik.errors.password ? 'input-error' : ''}`}
					placeholder={t('newPassword')}
					autoComplete="off"
					value={formik.values.password}
					onChange={formik.handleChange}
				/>
			</div>
			<div className="form-control w-full mt-4">
				<input
					name="confirm"
					type="password"
					className={`input input-bordered w-full bg-transparent ${formik.touched.confirm && formik.errors.confirm ? 'input-error' : ''}`}
					placeholder={t('confirmPassword')}
					autoComplete="off"
					value={formik.values.confirm}
					onChange={formik.handleChange}
				/>
			</div>
			<div className="mt-8">
				<button
					type="submit"
					className="btn btn-primary w-full font-light transition transition-width"
					disabled={loading || !formik.isValid}
				>
					{t('save')} {loading && <span className="loading loading-dots loading-sm"></span>}
				</button>
			</div>
		</form>
	)
}

export default ResetPasswordForm