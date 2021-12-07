import React, {useMemo} from 'react';
import {TourCard, OrdinoScrollspy} from '../../components';
import {BrowserRouter} from 'react-router-dom';
import {OrdinoFooter} from '../../../components';
import {TourUtils, ITDPTourExtensionDesc, ITDPTourExtension, useAsync} from 'tdp_core';
import {PluginRegistry, IPlugin, I18nextManager} from 'tdp_core';
import {IStartMenuTabProps} from '../StartMenu';


export default function ToursTab(_props: IStartMenuTabProps) {
  const loadTours = useMemo(() => () => {
    const tourEntries = PluginRegistry.getInstance().listPlugins(TourUtils.EXTENSION_POINT_TDP_TOUR).map((d) => d as ITDPTourExtensionDesc);
    return Promise.all(tourEntries.map((tour) => tour.load()));
  }, []);

  const {status, value: tours} = useAsync(loadTours, []);
  const beginnerTours = tours?.filter((tour) => tour.desc.level === 'beginner');
  const advancedTours = tours?.filter((tour) => tour.desc.level === 'advanced');

  return (
    <>
    {status === 'success' ?
      <OrdinoScrollspy>
        <div className="container pb-10 pt-5 tours-tab">
          <p className="lead text-gray-600">Learn more about Ordino by taking an interactive guided tour</p>
          {beginnerTours ?
            <ToursSection level="beginner" tours={beginnerTours}></ToursSection>
          : null}
          {advancedTours ?
            <ToursSection level="advanced" tours={advancedTours}></ToursSection>
          : null}
        </div>
        <BrowserRouter basename="/#">
          <OrdinoFooter openInNewWindow testId="tours-tab" />
        </BrowserRouter>
      </OrdinoScrollspy> : null}
    </>
  );
}


export function ToursSection(props: {level: 'beginner' | 'advanced', tours: (IPlugin & ITDPTourExtension)[], hrefBase?: string}) {
  if (props.tours.length === 0) {
    return null;
  }

  const loadTourImages = useMemo(() => () => {
    return Promise.all(props.tours.map(async (tour) => {
      if (!tour.desc.preview) { // preview function is optional
        return Promise.resolve(null);
      }

      const module: any = await tour.desc.preview(); // uses `import('/my/asset.jpg')` to load image as module
      return module.default; // use default export of module -> contains the URL as string from Webpack loader
    }));
  }, [props.tours]);

  const {status, value: images} = useAsync(loadTourImages, []);

  return (
    <>
      {status === 'success' ?
        <>
          <h4 className="text-start mt-4 mb-3  d-flex align-items-center text-capitalize"><i className="me-2 ordino-icon-1 fas fa-chevron-circle-right"></i> {(props.level === 'beginner') ? I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.tourLevelBeginner') : I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.tourLevelAdvanced')}</h4>
          <div className="mb-4 row row-cols-md-3" data-testid="tourssection">
            {props.tours.map((tour, index) => {
              // either hrefBase or onClickHandler
              const href = (props.hrefBase) ? props.hrefBase.replace('{id}', tour.desc.id) : null;
              const onClickHandler = (!props.hrefBase) ? (evt) => TourUtils.startTour(tour.desc.id) : null;

              return <TourCard key={tour.desc.id} id={tour.desc.id} title={tour.desc.name} text={tour.desc.description} image={images?.[index] || null} onClickHandler={onClickHandler} href={href}></TourCard>;
            })}
          </div>
        </>
        : null}
    </>
  );
}
