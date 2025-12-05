import {useNavigate} from "react-router-dom";
import useI18n from "../../hooks/useI18n.ts";
import {GiArchiveRegister, GiBookmarklet, GiBookPile, GiTalk} from "react-icons/gi";


function Service() {

	const navigate = useNavigate();
	const { t } = useI18n();

	const services = [
		{
			icon: <GiBookPile className="text-primary text-2xl" />,
			title: t('components:landing.services.service1.title') ,
			description: t('components:landing.services.service1.description'),
			route: "/dashboard/documents"
		},
		{
			icon: <GiBookmarklet className="text-primary text-2xl" />,
			title: t('components:landing.services.service2.title') ,
			description: t('components:landing.services.service2.description'),
			route: "/dashboard/reservations"
		},
		{
			icon: <GiArchiveRegister className="text-primary text-2xl" />,
			title: t('components:landing.services.service3.title') ,
			description: t('components:landing.services.service3.description'),
			route: "/dashboard/users"
		},
		{
			icon: <GiTalk className="text-primary text-2xl" />,
			title: t('components:landing.services.service4.title') ,
			description: t('components:landing.services.service4.description'),
			route: "/dashboard/settings"
		}
	];

	return (
		<section className="py-16 bg-white">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-2">
					<span className="inline-block animate-bounce mr-2">📚</span>
					{t('components:landing.services.title') }
				</h2>

				<p className="text-lg text-center mb-8">
					{t('components:landing.services.description') }
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
					{services.map((service, idx) => (
						<button
							key={idx}
							onClick={() => navigate(service.route)}
							className="bg-white hover:bg-primary/5 border border-gray-200 rounded-lg p-6 shadow-md text-left transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg"
						>
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
								{service.icon}
							</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-800">{service.title}</h3>
							<p className="text-gray-600">{service.description}</p>
						</button>
					))}
				</div>

			</div>
		</section>
	);
}

export default Service;