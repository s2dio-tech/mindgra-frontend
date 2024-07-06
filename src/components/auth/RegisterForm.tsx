import React, { useState } from "react"
import { useTranslation } from 'next-i18next'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import { registerAction } from "../../redux/_auth.redux";
import { showToast } from "../../common/toast";

const RegisterForm: React.FC<{
	loginClick: () => void
}> = ({
	loginClick
}) => {

	const { t } = useTranslation('common')
	const dispatch = useDispatch();

	const [loading, setLoading] = useState<boolean>(false)

	const formik = useFormik({
		initialValues: {
			name: '',
			email: '',
			password: '',
		},
		validationSchema: Yup.object({
			name: Yup.string().required(t('required')).max(50, t('tooLong')),
			email: Yup.string().email(t('invalidEmailAddress')).required(t('required')),
			password: Yup.string().required(t('required')).max(50, t('tooLong')),
		}),
		onSubmit: async (values) => {
			setLoading(true)
			await dispatch(registerAction({
				name: values.name,
				email: values.email,
				password: values.password,
			})).then(() => {
				showToast('success', t('welcomeName', {name: values.name}))
			}).catch((err: Error) => {
				showToast('error', t(err.message))
			}).finally(() => {
				setLoading(false);
			})
		},
	});

	return (
		<div className="w-full">
			<div>
				<h1 className="text-xl text-secondary font-mono pl-1">{t('register')}</h1>
			</div>
			<form className="w-full mt-10" onSubmit={formik.handleSubmit}>
				<div className="form-control w-full">
					<input
						name="name"
						type="text"
						className={`input input-bordered w-full bg-transparent ${formik.touched.name && formik.errors.name ? 'input-error' : ''}`}
						placeholder={t("fullName")}
						autoFocus={true}
						autoComplete="name"
						value={formik.values.name}
						onChange={formik.handleChange}
					/>
				</div>
				<div className="form-control w-full mt-4">
					<input
						name="email"
						type="text"
						className={`input input-bordered w-full bg-transparent ${formik.touched.email && formik.errors.email ? 'input-error' : ''}`}
						placeholder={t('email')}
						autoComplete="username"
						value={formik.values.email}
						onChange={formik.handleChange}
					/>
				</div>
				<div className="form-control w-full mt-4">
					<input
						name="password"
						type="password"
						className={`input input-bordered w-full bg-transparent ${formik.touched.password && formik.errors.password ? 'input-error' : ''}`}
						placeholder={t('password')}
						id="current-password"
						autoComplete="off"
						value={formik.values.password}
						onChange={formik.handleChange}
					/>
				</div>
				<div className="mt-8">
					<button
						type="submit"
						className="btn btn-primary w-full font-light transition transition-width"
						disabled={loading}
					>
						{t('register')} {loading && <span className="loading loading-dots loading-sm"></span>}
					</button>
				</div>
			</form>
			<p className="mt-8 text-center">
				{t('haveAnAccount')}
				<a className="uppercase link link-secondary ml-4"
					onClick={e => {
						e.preventDefault()
						loginClick()
					}}
				>{t('login')}</a>
			</p>
		</div>
	)
}

export default RegisterForm