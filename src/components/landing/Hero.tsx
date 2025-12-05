import {HeroImage} from "../common/HeroImage.tsx";
import {useNavigate} from "react-router-dom";
import useI18n from "../../hooks/useI18n.ts";
import {useConfig} from "../theme/ConfigProvider.tsx";

function Hero() {

	const navigate = useNavigate();
	const { config } = useConfig();
	const { t } = useI18n();

	const handleEnterSystem = () => {
		navigate('/dashboard');
	};
	return (
		<section className="bg-gradient-to-b from-primary/10 to-white flex-grow">
			<div className="container mx-auto px-4 min-h-[80vh] flex items-center">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-center">
					{/* Left Content */}
					<div className="space-y-8">
						<h1 className="text-4xl md:text-5xl font-bold text-gray-800">
							{t('components:landing.hero.title')}{" "}
							<span className="text-primary">{config.Name ||  t('common:app_name') }</span>
						</h1>

						<p className="text-lg text-gray-600 leading-relaxed">
							{t('components:landing.hero.description') }
						</p>

						<p className="text-lg text-gray-600 leading-relaxed">
							{t('components:landing.hero.manage_documents')}
						</p>

						<div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
							<button
								onClick={handleEnterSystem}
								className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
							>
								{t('components:landing.hero.cta_button')}
							</button>
						</div>
					</div>

					{/* Right Hero Image */}
					<div className="flex justify-center">
						<HeroImage
							backgroundColor="bg-gradient-to-br from-secondary-700 to-primary-500"
							className="w-full max-w-lg"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Hero;