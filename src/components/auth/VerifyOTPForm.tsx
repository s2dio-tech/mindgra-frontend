import React from "react"
import { useTranslation } from 'next-i18next'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PinInput from "../input/PinInput";

const VerifyOTPForm: React.FC<{
	loading: boolean,
	onSubmit: (otp: string) => void
}> = ({
	loading,
	onSubmit
}) => {
	const { t } = useTranslation('common')

	const formik = useFormik({
		initialValues: {
			otp: '',
		},
		validationSchema: Yup.object({
			otp: Yup.string().required(t('required')).length(6),
		}),
		onSubmit: async (values) => {
			onSubmit(values.otp)
		},
	});

	return (
		<div className="w-full">
			<form className="w-full mt-10" onSubmit={formik.handleSubmit}>
				<div className="form-control w-full">
					<PinInput
						length={6}
						onChange={val => formik.setFieldValue('otp', val)}
						error={formik.touched.otp && Boolean(formik.errors.otp)}
					/>
				</div>
				<div className="mt-4">
					<button
						type="submit"
						className="btn btn-primary w-full font-light transition transition-width"
						disabled={loading || !formik.isValid}
					>
						{t('verify')}
						{loading && <span className="loading loading-dots loading-sm"></span>}
					</button>
				</div>
			</form>
		</div>
	)
}

export default VerifyOTPForm