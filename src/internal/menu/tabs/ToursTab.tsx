import React, {useMemo} from 'react';
import {Row, Container} from 'react-bootstrap';
import {TourCard, OrdinoScrollspy} from '../../components';
import {BrowserRouter} from 'react-router-dom';
import {OrdinoFooter} from '../../../components';
import {TourUtils, ITDPTourExtensionDesc, ITDPTourExtension} from 'tdp_core';
import {PluginRegistry, IPlugin} from 'phovea_core';
import {useAsync} from '../../../hooks';
import {IStartMenuTabProps} from '../StartMenu';


export function ToursTab(_props: IStartMenuTabProps) {
  const loadTours = useMemo(() => () => {
    const tourEntries = PluginRegistry.getInstance().listPlugins(TourUtils.EXTENSION_POINT_TDP_TOUR).map((d) => d as ITDPTourExtensionDesc);
    return Promise.all(tourEntries.map((tour) => tour.load()));
  }, []);

  const {status, value: tours} = useAsync(loadTours);

  const beginnerTours = tours?.filter((tour) => tour.desc.level === 'beginner');
  const advancedTours = tours?.filter((tour) => tour.desc.level === 'advanced');

  return (
    <>
    {status === 'success' ?
      <OrdinoScrollspy>
        <Container className="pb-10 pt-5 tours-tab">
          <p className="lead text-ordino-gray-4">Learn more about Ordino by taking an interactive guided tour</p>
          {beginnerTours ?
            <ToursSection level="beginner" tours={beginnerTours}></ToursSection>
          : null}
          {advancedTours ?
            <ToursSection level="advanced" tours={advancedTours}></ToursSection>
          : null}
        </Container>
        <BrowserRouter basename="/#">
          <OrdinoFooter openInNewWindow />
        </BrowserRouter>
      </OrdinoScrollspy> : null}
    </>
  );
}


function ToursSection(props: {level: 'beginner' | 'advanced', tours: (IPlugin & ITDPTourExtension)[]}) {
  if(props.tours.length === 0) {
    return null;
  }

  const loadTourImages = useMemo(() => () => {
    return Promise.all(props.tours.map(async (tour) => {
      if(!tour.desc.preview) { // preview function is optional
        return Promise.resolve(null);
      }

      const module = await tour.desc.preview(); // uses `import('/my/asset.jpg')` to load image as module
      return module.default; // use default export of module
    }));
  }, [props.tours]);

  const {status, value: images} = useAsync(loadTourImages);

  return (
    <>
      {status === 'success' ?
        <>
          <h4 className="text-left mt-4 mb-3  d-flex align-items-center text-capitalize"><i className="mr-2 ordino-icon-1 fas fa-chevron-circle-right"></i> {props.level}</h4>
          <Row className="mb-4" md={3}>
            {props.tours.map((tour, index) => {
              return <TourCard key={tour.desc.id} title={tour.desc.name} text={tour.desc.description} image={images[index]} onClickHandler={(evt) => TourUtils.startTour(tour.desc.id)}></TourCard>;
            })}
          </Row>
        </>
      : null}
    </>
  );
}
