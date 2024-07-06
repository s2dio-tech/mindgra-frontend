import React, { useEffect } from "react"
import { useTranslation } from 'next-i18next'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Graph } from "../domain/models";
import { Icon, IconWarning } from "./Icons";

const GraphForm: React.FC<{
	title: string,
	loading: boolean,
	graph?: Graph,
	error?: any,
	onSubmit: (data: any) => Promise<void>,
}> = ({
	title,
	loading,
	graph,
	error,
	onSubmit
}) => {
	const { t } = useTranslation('common')

	const formik = useFormik({
		initialValues: {
			name: '',
		},
		validationSchema: Yup.object({
			name: Yup.string().required(t('required')),
		}),
		onSubmit: async (values) => {
			await onSubmit({
				name: values.name
			})
		},
	});

	useEffect(() => {
		formik.setFieldValue('name', graph?.name || '')
	}, [graph])

	return (
		<div className="w-full">
			<div>
				<h1 className="text-xl text-secondary font-mono pl-1 mb-2">{title}</h1>
			</div>
			<form className="w-full" onSubmit={formik.handleSubmit}>
				{Boolean(error) && (
					<div role="alert" className="alert alert-error text-sm p-2 mb-2">
						<Icon icon={IconWarning} className="w-4 h-4"/>
						<span>{t(error.message) || (t('somethingWentWrong'))}</span>
					</div>
				)}
				<div className="form-control w-full">
					<input
						name="name"
						type="text"
						className={`input input-bordered w-full bg-transparent ${formik.touched.name && formik.errors.name ? 'input-error' : ''}`}
						placeholder={t('graphName')}
						autoFocus={true}
						value={formik.values.name}
						onChange={formik.handleChange}
					/>
				</div>
				<div className="mt-4">
					<button
						type="submit"
						className="btn btn-primary w-full font-light transition transition-width"
						disabled={loading}
					>
						{t('save')} {loading && <span className="loading loading-dots loading-sm"></span>}
					</button>
				</div>
			</form>
		</div>
	)
}

export default GraphForm