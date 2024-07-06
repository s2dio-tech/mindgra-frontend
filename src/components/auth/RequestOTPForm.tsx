import React from "react"
import { useTranslation } from 'next-i18next'
import { useFormik } from 'formik';
import * as Yup from 'yup';

const RequestOTPForm: React.FC<{
	loading: boolean,
	onSubmit: (email: string) => void
}> = ({
	loading,
	onSubmit
}) => {

	const { t } = useTranslation('common')

	const formik = useFormik({
		initialValues: {
			email: '',
		},
		validationSchema: Yup.object({
			email: Yup.string().email(t('invalidEmailAddress')).required(t('required')),
		}),
		onSubmit: async (values) => {
			onSubmit(values.email)
		},
	});

	return (
		<form className="w-full" onSubmit={formik.handleSubmit}>
			<div className="form-control w-full mt-4">
				<input
					name="email"
					type="text"
					className={`input input-bordered w-full ${formik.touched.email && Boolean(formik.errors.email) ? 'input-error' : ''}`}
					placeholder={t('email')}
					autoComplete="username"
					value={formik.values.email}
					onChange={formik.handleChange}
				/>
			</div>
			<div className="mt-8">
				<button
					type="submit"
					className="btn btn-primary w-full font-light transition transition-width"
					disabled={loading || !formik.isValid}
				>
					{t('send')} {loading && <span className="loading loading-dots loading-sm"></span>}
				</button>
			</div>
		</form>
	)
}

export default RequestOTPForm