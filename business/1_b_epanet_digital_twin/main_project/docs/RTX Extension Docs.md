Coding Conventions
This document lists the C++ coding conventions used in the EPANET-RTX project.

Types
Names representing types must be in CamelCase, i.e. mixed case starting with upper case, such as Point and TimeSeries.

Class Methods and Functions
Class method and function names must be in mixed case starting with lower case, such as id, flow, setFlow and headLoss. The term set must be used where an attribute value is set (setFlow) but the term get should be avoided (flow instead of getFlow).

Constants
Named constants (including enumeration values) must be all uppercase using underscore to separate words, such as FLOW, HEAD_LOSS and METERS_TO_FEET. Floating point constant should always be written with decimal point and at least one decimal and a digit before the point, such as 0.5 and 100.0.

Macros
Macros should be avoided (use const or templates). If needed, macro names must be the same of named constants plus a RTX_ prefix, such as RTX_MAX_C_STRING and RTX_DO_SOMETHING. Variables Variable names must be in mixed case starting with lower case, such as index, numberOfValues and indexOfNode. Variables with a large scope should have long names, variables with a small scope can have short names. Variables should be declared and initialised immediately before their use.

Class Attributes
Private attribute names must follow the same conventions as variables, but with a single underscore as prefix, such as _flow, _headLoss and _id.

Reference and Pointer Declaration
C++ pointers and references should have their reference symbol next to the type rather than to the name, such as int* foo; and char& bar;. Use multiples lines to declare pointers and references.

Class Declaration
The declaration of a class should be started with the declaration of the types used (typedef) followed by the declaration of constants. Then, it should list the public methods, followed by the protected and privates methods and attributes: class ExampleClass { // typedef types // constants public: // methods protected: //methods // attributes private: //methods // attributes };

Containers
Plural form should be used on names representing a collection of objects, such as vector<double> values. Boolean The prefix is should be used for boolean variables and methods relating to states, such as isOpen and isClosed. The prefix "does" should be used for boolean variables and methods relating to behavior, such as doesHaveBoundaryHead.

Number of Objects
The postfix Count should be used for variables and methods representing a number of objects, such as NodeCount.

Files Extensions
C++ header files should have a .h extension. Source files should have the extension .cpp.

Class Files
A class should be declared in a header file and defined in a source file where the name of the files match the name of the class, such as Element.h and Element.cpp. A file can contain more than one class if the extra classes are derived from a common parent, in which case the filename should reflect this with a family postfix (e.g., ElementFamily.h).

File Characteristics
Special characters like TAB and page break must be avoided.

Header File Guards
Header files must contain an include guard that is composed of the prefix epanet_rtx_, the postfix _h and the name of the file in lower-case, using underscore to separate words:

#ifndef epanet_rtx_Zone_h
#define epanet_rtx_Zone_h

// file contents

#endif
Comments
Use single-line //, and multiline /*...*/ for comments. Comment as much as you can and use Doxygen markup for critical sections.

Indentation and nesting
The indentation delimiter is two spaces (never a tab character) and should adhere to the following nesting guidelines:

class Name {
...
};
...
for(...) {
    ... // use brackets even if it's a single line!
} // ending comment if it's a long chunk of code
...
void func(...) {
    ...
} // ending comment if it's a long chunk of code


Time Series Conceptual Demonstration
//
//  timeseries_demo.cpp
//
//  Created by the EPANET-RTX Development Team
//  See README.md and license.txt for more information
//  
#include <iostream>
#include <stdlib.h>
#include <boost/foreach.hpp>
#include <boost/random.hpp>
#include "Point.h"
#include "TimeSeries.h"
#include "Resampler.h"
#include "MovingAverage.h"
#include "FirstDerivative.h"
#include "SineTimeSeries.h"
#include "ConstantTimeSeries.h"
#include "AggregatorTimeSeries.h"
#include "CsvPointRecord.h"
#include "GainTimeSeries.h"
#include "FailoverTimeSeries.h"
#include "TimeOffsetTimeSeries.h"
#include "WarpingTimeSeries.h"
#include "ForecastTimeSeries.h"
#include "TimeOffsetTimeSeries.h"
#include "OutlierExclusionTimeSeries.h"
#include "BufferPointRecord.h"
#include "MysqlPointRecord.h"
//#include "SqliteProjectFile.h"
#include "SqlitePointRecord.h"
#include "PythonInterpreter.h"
using namespace RTX;
using namespace std;
void printPoints(vector<Point> pointVector);
int main(int argc, const char * argv[])
{
  
  Clock::sharedPointer clock(new Clock(900));
  
  SineTimeSeries::sharedPointer sineWave(new SineTimeSeries());
  sineWave->setName("sine");
  sineWave->setClock(clock);
  
  TimeOffsetTimeSeries::sharedPointer lag(new TimeOffsetTimeSeries());
  lag->setOffset(900);
  lag->setSource(sineWave);
  
  time_t t1 = 1400004000; //time(NULL);
  time_t t2 = t1 + 3600;
  vector<Point> points = lag->points(t1, t2);
  
  printPoints(sineWave->points(t1, t2));
  cout << endl;
  printPoints(points);
  
  
  
  /*
  
  
  ForecastTimeSeries::sharedPointer pythonTestTs(new ForecastTimeSeries());
  
  pythonTestTs->setSource(sineWave);
  
  vector<Point> testPoints = pythonTestTs->points(1000, 3000);
  
  printPoints(testPoints);
  
  
  vector<Point> range;
  
  */
  
  
  return 0;
}
void printPoints(vector<Point> pointVector) {
  BOOST_FOREACH(Point thePoint, pointVector) {
    cout << thePoint << endl;
  }
}

# RTX configuration file format
# comments
// comments
/* comments */
version = "1.0";
configuration:
{
# point records
  records = (
             {
               name = "mysql record name";
               type = "MySQL";
               connection = "DB=RTX_db_name;UID=mysql_user;PWD=mysql_pass;HOST=tcp://localhost;";
             },
             {
               name = "csv record";
               type = "CSV";
               path = "csv_data";
               readonly = false;
             },
             {
               name = "Scada Historian";
               type = "SCADA";
               connection = "DRIVER=TDS;SERVER=192.168.1.2;UID=scada_user;PWD=scada_pass;DATABASE=Runtime;TDS_Version=7.0;Port=1433;";
               querySyntax = {
                 Table =         "History";
                 DateColumn =    "DateTime";
                 TagColumn =     "TagName";
                 ValueColumn =   "Value";
                 QualityColumn = "Quality";
               };
               connectorType = "wonderware_mssql";
             }
             
             ); // records
  
# regular timeseries clocks
  clocks = (
            {
              name = "1m";
              type = "regular";
              period = 60;
              start = 0;
            },
            {
              name = "15m";
              type = "regular";
              period = 900;
              start = 0;
            }
            ); // clocks
  
  timeseries = (
                {
                  name = "Scada_tag_1_flowrate";
                  type = "TimeSeries";
                  description = "description of tag";
                  pointRecord = "Scada Historian";
                  units = "gpm"; // gallons per minute -- see Units.h for list of recognized units
                },
                {
                  name = "Tag 1 flow (regular)";
                  type = "Resampler";
                  source = "Scada_tag_1_flowrate";
                  clock = "1m";
                  units = "lps"; // liters per second
                },
                {
                  name = "Tag 1 flow (smooth)";
                  type = "MovingAverage";
                  source = "Tag 1 flow (regular)";
                  clock = "1m";
                  window = 10;
                  units = "lps";
                },
                {
                  name = "Scada_tag_2_tanklevel";
                  type = "TimeSeries";
                  description = "description of tag";
                  pointRecord = "Scada Historian";
                  units = "ft"; // feet -- see Units.h for list of recognized units
                },
                {
                  name = "Tag 2 level (regular)";
                  type = "Resampler";
                  clock = "1m";
                  source = "Scada_tag_2_tanklevel";
                  units = "m"; // meters
                },
                {
                  name = "Tag 2 level (smooth)";
                  type = "MovingAverage";
                  source = "Tag 2 level (regular)";
                  clock = "1m";
                  window = 10;
                  units = "m"; // meters
                },
                {
                  name = "Tag 2 volume";
                  type = "CurveFunction";
                  source = "Tag 2 level (smooth)";
                  clock = "1m";
                  units = "l"; // liters as output "y" units
                  inputUnits = "m"; // meters as units of "x" values below...
                  function = (
                              {x=0;   y=0;  },
                              {x=1;   y=.5; },
                              {x=2;   y=.8; },
                              {x=3;   y=1;  },
                              {x=4;   y=1.2;}
                              )
                },
                {
                  name = "Tag 2 flow";
                  type = "Derivative";
                  source = "Tag 2 volume";
                  clock = "1m";
                  units = "lps";
                },
                {
                  name = "Area Demand";
                  type = "Aggregator";
                  units = "lps";
                  sources = (
                             {source = "Tag 2 flow"; multiplier = -1.0; }, // flow "in" to a tank is "out" of the area
                             {source = "Tag 1 flow (smooth)"; multiplier = 1.0; }
                             );
                },
                {
                  name = "MultiplierTS";
                  type = "Multiplier";
                  units = "mgd";
                  source = "Area Demand";
                  multiplier = "Tag 2 flow"; // basis for multiplication
                },
                {
                  name = "Valid Range Test";
                  type = "ValidRange";
                  units = "lps";
                  source = "Tag 2 flow";
                  range_min = -1;
                  range_max = 1;
                  mode = "drop"; // or "saturate"
                }
                {
                  name = "RuntimeStatusTS";
                  type = "RuntimeStatus";
                  source = "Pump_1_Runtime";
                  thresholdValue = 60.0; // seconds
                }
                ); // timeseries
  
  model = {
    file = "modelFile.inp";
    type = "epanet";
    
  }; // model
  
  
  
  elements = (
              {
                model_id = "model_pump";
                timeseries = "Pump Status TS";
                parameter = "pumpstatus";
              },
              {
                model_id = "model_tank";
                timeseries = "Tag 2 level (smooth)";
                parameter = "tanklevel";
              },
              {
                model_id = "model_plant_source_node";
                timeseries = "Tag 1 flow (smooth)";
                parameter = "boundaryflow";
              }
              ); // elements
  // parameters (measurements): pressuremeasure / headmeasure / levelmeasure / quality / flow / energy
  // parameters (boundaries):   boundaryflow / boundaryhead / status / setting / qualitysource
  
# simulation properties
  simulation = {
    time = {
      hydraulic = 600;  // 10m
      quality = 60;     // 1m
    };
  }; // simulation
  
  save = {
    staterecord = "sampletown_realtime";
    save_states = ( "measured", "dma_demand" );
    /* states == all / head / flow / quality / energy / demand / dma_demand / status / setting / error / measured*/
  };
  
  dma = {
    auto_detect = true;
    detect_closed_links = true;
  }; // dma
}; // configuration
Generated for Epanet-RTX by Doxygen



RTX Model Validation Application
//
//  validator.cpp
//  rtx-validator
//
//  Created by the EPANET-RTX Development Team
//  See README.md and license.txt for more information
//  
#include <iostream>
#include <time.h>
#include <boost/foreach.hpp>
#include "ConfigProject.h"
#include "EpanetModel.h"
using namespace std;
using namespace RTX;
//void runSimulationUsingConfig(const string& path, time_t someTime, long duration);
int main (int argc, const char * argv[])
{
  string forwardSimulationConfig(""), realtimeConfig("");
  if (argc > 1) {
    forwardSimulationConfig = string( argv[1] );
  }
  if (argc > 2) {
    realtimeConfig = string( argv[2] );
  }
  
  time_t someTime = 1222873200; // unix-time 2008-10-01 15:00:00 GMT
  long duration = 60 * 60 * 24; // 1 day
  
  forwardSimulationConfig = "/Users/sam/Copy/Code/epanet-rtx/examples/validator/sampletown_synthetic.cfg";
  
  EpanetModel::sharedPointer model( new EpanetModel );
  model->loadModelFromFile("/Users/sam/Copy/Code/epanet-rtx/examples/validator/sampletown.inp");
  
  vector<Pipe::sharedPointer> pipes = model->pipes();
  BOOST_FOREACH(Pipe::sharedPointer p, pipes) {
    if (RTX_STRINGS_ARE_EQUAL(p->name(), "4")) {
      TimeSeries::sharedPointer flow( new TimeSeries );
      flow->setUnits(RTX_GALLON_PER_MINUTE);
      p->setFlowMeasure(flow);
    }
  }
  
  model->initDMAs();
  
  // test the forward synthetic simulation
  //runSimulationUsingConfig(forwardSimulationConfig, someTime-3600, duration+7200);
  
  realtimeConfig = "/Users/sam/Copy/Code/epanet-rtx/examples/validator/sampletown_realtime.cfg";
  
  // test the real-time methods
//  runSimulationUsingConfig(realtimeConfig, someTime, duration);
  
  
  return 0;
}
//
//void runSimulationUsingConfig(const string& filePath, time_t someTime, long duration) {
//  
//  ConfigProject config;
//  Model::sharedPointer model;
//  
//  try {
//    config.loadConfigFile(filePath);
//    
//    model = config.model();
//    
//    cout << "RTX: Running simulation for..." << endl;
//    cout << *model;
//    
//    PointRecord::sharedPointer record = config.defaultRecord();
//  
//    model->runExtendedPeriod(someTime, someTime + duration);
//    
//    cout << "... done" << endl;
//    
//  } catch (string err) {
//    cerr << err << endl;
//  }
//}


# sampletown configuration file -- forward simulation of sampletown network
version = "1.0";
configuration:
{
# point records
  records = (
             {
               # Specify a MySQL database.
               # Uses the MySQL C++ Connector, based on the JDBC API.
               # use either "tcp://ipaddress.or.name.of.server"
               # or "unix://path/to/unix_socket_file"
               name = "sampletown_synthetic";
               type = "MySQL";
               connection = "DB=RTX_sampletown_synthetic;UID=rtx_db_agent;PWD=rtx_db_agent;HOST=tcp://localhost;";
             }
             ); // records
  
  simulation = {
    
    # specify hyd and wq timesteps - this overrides whatever is in the model file
    time = {
      hydraulic = 60;
      quality = 60;
    };
  }; // simulation
  save = {
    # staterecord - specify the name of a record (from above section)
    # this will store all hydraulic state information (head, flow, demand)
    staterecord = "sampletown_synthetic";
    save_states = ( "all" );
  };
  
  model = {
    file = "sampletown.inp";
    # type -- either "synthetic_epanet" (model-based control rules) or "epanet" (control rules are stripped)
    type = "synthetic_epanet";
  }; // model
  
}; // configuration

 sampletown configuration file -- forward simulation of sampletown network
version = "1.0";
configuration:
{
# point records
  records = (
             {
               # Specify a MySQL database.
               # Uses the MySQL C++ Connector, based on the JDBC API.
               # use either "tcp://ipaddress.or.name.of.server"
               # or "unix://path/to/unix_socket_file"
               name = "sampletown_synthetic";
               type = "MySQL";
               connection = "DB=RTX_sampletown_synthetic;UID=rtx_db_agent;PWD=rtx_db_agent;HOST=tcp://localhost;";
             }
             ); // records
  
  simulation = {
    
    # specify hyd and wq timesteps - this overrides whatever is in the model file
    time = {
      hydraulic = 60;
      quality = 60;
    };
  }; // simulation
  save = {
    # staterecord - specify the name of a record (from above section)
    # this will store all hydraulic state information (head, flow, demand)
    staterecord = "sampletown_synthetic";
    save_states = ( "all" );
  };
  
  model = {
    file = "sampletown.inp";
    # type -- either "synthetic_epanet" (model-based control rules) or "epanet" (control rules are stripped)
    type = "synthetic_epanet";
  }; // model
  
}; // configuration
Real-Time Simulation Configuration File
# sampletown configuration file - realtime version
version = "1.0";
configuration:
{
  
  # point records
  records = (
             {
               name = "sampletown_synthetic";
               type = "MySQL";
               connection = "DB=RTX_sampletown_synthetic;UID=rtx_db_agent;PWD=rtx_db_agent;HOST=tcp://localhost;";
             },
             {
               name = "sampletown_realtime";
               type = "MySQL";
               connection = "DB=RTX_sampletown_realtime;UID=rtx_db_agent;PWD=rtx_db_agent;HOST=tcp://localhost;";
             }
             ); // records
  
  
  # regular clocks
  clocks = (
            {
              name = "1m";
              type = "regular";
              period = 60;
              start = 0;
            },
            {
              name = "10m";
              type = "regular";
              period = 600; // == 10 minutes
              start = 0;
            }
            ); // clocks
  
  
  
  timeseries = (
                # source time series - these are not strictly regular
                
                {
                  name = "N Mills demand";
                  type = "TimeSeries";
                  description = "Mills demand - metered";
                  pointRecord = "sampletown_synthetic";
                  units = "gpm";
                },
                {
                  name = "L ReservoirCheckValve flow";
                  type = "TimeSeries";
                  description = "supply flow";
                  pointRecord = "sampletown_synthetic";
                  units = "gpm";
                },
                {
                  name = "N NewportTank head";
                  type = "TimeSeries";
                  description = "Tank Head Measurement";
                  pointRecord = "sampletown_synthetic";
                  units = "ft";
                },
                {
                  name = "L 4 flow";
                  type = "TimeSeries";
                  description = "interzone flow meter";
                  pointRecord = "sampletown_synthetic";
                  units = "gpm";
                },
                
                # resamplers - so that we have regular time series
                
                
                {
                  name = "Mills Demand (resampled)";
                  type = "Resampler";
                  clock = "1m";
                  source = "N Mills demand";
                  units = "gpm";
                },
                {
                  name = "Supply flow (resampled)";
                  type = "Resampler";
                  clock = "1m";
                  source = "L ReservoirCheckValve flow";
                  units = "gpm";
                },
                
                {
                  name = "Tank Head (resampled)";
                  type = "Resampler";
                  clock = "1m";
                  source = "N NewportTank head";
                  units = "ft";
                },
                
                {
                  name = "Interzone Flow (resampled)";
                  type = "Resampler";
                  clock = "1m";
                  source = "L 4 flow";
                  units = "gpm";
                },
                
                
                // water quality signals
                {
                  name = "node quality";
                  type = "Constant";
                  clock = "1m";
                  units = "mg/l";
                  value = 12;
                }
                
                ); // end timeseries
  
  
  model = {
    file = "sampletown.inp";
    type = "epanet";
    
  }; // model
  
  elements = (
              # associate source data with model elements (and define which parameter they are linked to)
              # metered demand
              {
                model_id = "Mills";
                timeseries = "Mills Demand (resampled)";
                parameter = "flow_boundary";
              },
              # tank
              {
                model_id = "NewportTank";
                timeseries = "Tank Head (resampled)";
                parameter = "head_measure";
              },
              # supply
              {
                model_id = "ReservoirCheckValve";
                timeseries = "Supply flow (resampled)";
                parameter = "flow_measure";
              },
              # flow
              {
                model_id = "4";
                timeseries = "Interzone Flow (resampled)";
                parameter = "flow_measure";
              },
              
# water quality
              
              {
                model_id = "TreatmentPlant";
                timeseries = "node quality";
                parameter = "quality_boundary";
              }
              ); // elements
  
  
  # simulation properties
  simulation = {
    time = {
      hydraulic = 600;  // 10m
      quality = 60;     // 1m
    };
  }; // simulation
  
  save = {
    staterecord = "sampletown_realtime";
    // save_states = ( "measured", "dma_demand" );
    save_states = ( "all" );
    /* states == all / head / flow / quality / energy / demand / dma_demand / status / setting / error / measured*/
  };
  
  dma = {
    auto_detect = true;
    detect_closed_links = true;
    //ignore_links = ( "link_id","link_id" );
  }; // dma
  
  
}; // configuration

