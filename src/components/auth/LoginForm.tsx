import React, { useState } from "react"
import { useTranslation } from 'next-i18next'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import { loginAction } from "../../redux/_auth.redux";
import { showToast } from "../../common/toast";
import { Icon, IconFacebook, IconGithub, IconGoogle } from "../Icons";

const LoginForm: React.FC<{
	forgotPasswordClick: () => void,
	registerClick: () => void
}> = ({
	forgotPasswordClick,
	registerClick
}) => {
	const { t } = useTranslation('common')
	const dispatch = useDispatch();

	const [loading, setLoading] = useState<boolean>(false)

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: Yup.object({
			email: Yup.string().email(t('invalidEmailAddress')).required(t('required')),
			password: Yup.string().required(t('required')),
		}),
		onSubmit: async (values) => {
			setLoading(true)
			await dispatch(loginAction({
				email: values.email,
				password: values.password,
			})).catch((err: Error) => {
				showToast('error', t(err.message))
			}).finally(() => {
				setLoading(false);
			})
		},
	});

	return (
		<div className="w-full">
			<div>
				<h1 className="text-xl text-secondary font-mono pl-1">{t('login')}</h1>
			</div>
			<form className="w-full mt-10" onSubmit={formik.handleSubmit}>
				<div className="form-control w-full">
					<input
						name="email"
						type="text"
						className={`input input-bordered w-full bg-transparent ${formik.touched.email && formik.errors.email ? 'input-error' : ''}`}
						placeholder="Email address"
						autoComplete="username"
						autoFocus={true}
						value={formik.values.email}
						onChange={formik.handleChange}
					/>
				</div>
				<div className="form-control w-full mt-4">
					<input
						name="password"
						type="password"
						className={`input input-bordered w-full bg-transparent ${formik.touched.password && formik.errors.password ? 'input-error' : ''}`}
						placeholder="Password"
						id="current-password"
						autoComplete="current-password"
						autoFocus={true}
						value={formik.values.password}
						onChange={formik.handleChange}
					/>
				</div>
				<p className="mt-4 text-right">
					<a className="link text-sm"
						onClick={e => {
							e.preventDefault()
							forgotPasswordClick()
						}}
					>{t('forgotPassword')}</a>
				</p>
				<div className="mt-4">
					<button
						type="submit"
						className="btn btn-primary w-full font-light transition transition-width"
						disabled={loading}
					>
						{t('login')} {loading && <span className="loading loading-dots loading-sm"></span>}
					</button>
				</div>
			</form>

			<p className="mt-8 text-center">
				{t('dontHaveAnAccount')}
				<a className="uppercase link link-secondary ml-4"
					onClick={e => {
						e.preventDefault()
						registerClick()
					}}
				>{t('register')}</a>
			</p>
			{/* <div className="divider lowercase text-sm mt-8">{t('or')}</div>
			<div className="flex justify-center space-x-8">
				<button className="btn btn-circle btn-md">
					<Icon icon={IconFacebook} className="w-5 h-5"/>
				</button>
				<button className="btn btn-circle">
					<Icon icon={IconGoogle} className="w-5 h-5"/>
				</button>
				<button className="btn btn-circle">
					<Icon icon={IconGithub} className="w-5 h-5"/>
				</button>
			</div> */}
		</div>
	)
}

export default LoginForm