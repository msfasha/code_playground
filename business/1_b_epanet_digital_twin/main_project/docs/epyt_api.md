API Documentation
EPANET-Python Toolkit (EPyT): A Python toolkit for EPANET libraries

How to run:

from epyt import epanet

d = epanet(‘Net1.inp’)

EPANET is software that models water distribution piping systems developed by the US EPA and provided under a public domain licence. This python toolkit serves as an interface between Python and EPANET, to assist researchers and the industry when solving problems related with water distribution systems.

EPANET was developed by the Water Supply and Water Resources Division of the U.S. Environmental Protection Agency’s National Risk Management Research Laboratory. EPANET is under the Public Domain.

The latest EPANET files can downloaded at: https://github.com/OpenWaterAnalytics/EPANET

Inspired by: EPANET-MATLAB Toolkit D.G. Eliades, M. Kyriakou, S. Vrachimis and M.M. Polycarpou, “EPANET-MATLAB Toolkit: An Open-Source Software for Interfacing EPANET with MATLAB”, in Proc. 14th International Conference on Computing and Control for the Water Industry (CCWI), The Netherlands, Nov 2016, p.8. (doi:10.5281/zenodo.831493)

Other python packages related to the EPANET engine: wntr Klise, K.A., Murray, R., Haxton, T. (2018). An overview of the Water Network Tool for Resilience (WNTR), In Proceedings of the 1st International WDSA/CCWI Joint Conference, Kingston, Ontario, Canada, July 23-25, 075, 8p.

epanet-python https://github.com/OpenWaterAnalytics/epanet-python

EPANET-Python Toolkit Licence:

Copyright 2022 KIOS Research and Innovation Center of Excellence (KIOS CoE), University of Cyprus (www.kios.org.cy)

Licensed under the EUPL, Version 1.2 or - as soon they will be approved by the European Commission - subsequent libepanets of the EUPL (the “Licence”) You may not use this work except in compliance with the Licence. You may obtain a copy of the Licence at:

https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12

Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an “AS IS” basis, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the Licence for the specific language governing permissions and limitations under the Licence.

classepyt.epanet.EpytValues[source]
Bases: object

disp()[source]
Displays the values on the command window

Parameters
:
self (EpytValues class) – Values to be printed on the command window

Returns
:
None

to_dict()[source]
Transform EpytValues class values to dict format

Parameters
:
self (EpytValues class) – Values to add in the dictionary

Returns
:
dictionary with the values

Return type
:
dict

to_excel(filename=None, attributes=None, allValues=False, node_id_list=None, link_id_list=None, both=False, header=True)[source]
Save to an Excel file the values of EpytValues class.

Parameters
:
filename (str, optional) – Excel filename, defaults to None

attributes (str or list of str, optional) – Attributes to add to the file, defaults to None

allValues (bool, optional) – If True, writes all the values into a separate “All values” sheet, defaults to False

node_id_list (list or np.ndarray, optional) – Array of IDs for node-related attributes

link_id_list (list or np.ndarray, optional) – Array of IDs for link-related attributes

both (bool, optional) – If True, and ID array available, print both ‘Index’ and ‘Id’. If no ID array, just Index. If False and ID array available, print only ‘Id’; if no ID array, print only ‘Index’.

header (bool, optional) – If False, remove the first row from all sheets and do not write column headers

Returns
:
None

to_json(filename=None)[source]
Transforms val class values to json object and saves them to a json file if filename is provided

Parameters
:
self (val class) – Values to add in the json file

filename (str, optional) – json filename, defaults to None

Returns
:
the json object with the values

Return type
:
json object

classepyt.epanet.ToolkitConstants[source]
Bases: object

EN_ACCURACY= 1
EN_AFD= 4
EN_AGE= 2
EN_AVERAGE= 1
EN_BASEDEMAND= 1
EN_BULKORDER= 19
EN_CANOVERFLOW= 26
EN_CFS= 0
EN_CHECKFREQ= 15
EN_CHEM= 1
EN_CM= 2
EN_CMD= 9
EN_CMH= 8
EN_CONCEN= 0
EN_CONCENLIMIT= 22
EN_CONTROL= 4
EN_CONTROLCOUNT= 5
EN_CURVE= 3
EN_CURVECOUNT= 4
EN_CVPIPE= 0
EN_DAMPLIMIT= 17
EN_DEFICIENTNODES= 5
EN_DEMAND= 9
EN_DEMANDCHARGE= 11
EN_DEMANDDEFICIT= 27
EN_DEMANDMULT= 4
EN_DEMANDREDUCTION= 6
EN_DIAMETER= 0
EN_DURATION= 0
EN_DW= 1
EN_ELEVATION= 0
EN_EMITEXPON= 3
EN_EMITTER= 3
EN_ENERGY= 13
EN_FCV= 6
EN_FIFO= 2
EN_FLOW= 8
EN_FLOWCHANGE= 6
EN_FLOWPACED= 3
EN_GLOBALEFFIC= 8
EN_GLOBALPATTERN= 10
EN_GLOBALPRICE= 9
EN_GPM= 1
EN_GPV= 8
EN_HALTFLAG= 13
EN_HEAD= 10
EN_HEADERROR= 5
EN_HEADLOSS= 10
EN_HEADLOSSFORM= 7
EN_HILEVEL= 1
EN_HTIME= 11
EN_HW= 0
EN_HYDSTEP= 1
EN_IMGD= 3
EN_INITFLOW= 10
EN_INITQUAL= 4
EN_INITSETTING= 5
EN_INITSTATUS= 4
EN_INITVOLUME= 14
EN_ITERATIONS= 0
EN_JUNCTION= 0
EN_KBULK= 6
EN_KWALL= 7
EN_LENGTH= 1
EN_LIFO= 3
EN_LINK= 1
EN_LINKCOUNT= 2
EN_LINKPATTERN= 15
EN_LINKQUAL= 14
EN_LOWLEVEL= 0
EN_LPM= 6
EN_LPS= 5
EN_MASS= 1
EN_MASSBALANCE= 4
EN_MAXCHECK= 16
EN_MAXFLOWCHANGE= 3
EN_MAXHEADERROR= 2
EN_MAXID= 32
EN_MAXIMUM= 3
EN_MAXLEVEL= 21
EN_MAXMSG= 255
EN_MAXVOLUME= 25
EN_MGD= 2
EN_MINIMUM= 2
EN_MINLEVEL= 20
EN_MINORLOSS= 3
EN_MINVOLUME= 18
EN_MIX1= 0
EN_MIX2= 1
EN_MIXFRACTION= 22
EN_MIXMODEL= 15
EN_MIXZONEVOL= 16
EN_MLD= 7
EN_NEXTEVENT= 14
EN_NEXTEVENTTANK= 15
EN_NODE= 0
EN_NODECOUNT= 0
EN_NONE= 0
EN_NOSAVE= 0
EN_PATCOUNT= 3
EN_PATTERN= 2
EN_PATTERNSTART= 4
EN_PATTERNSTEP= 3
EN_PBV= 5
EN_PERIODS= 9
EN_PIPE= 1
EN_PRESSURE= 11
EN_PRV= 3
EN_PSV= 4
EN_PUMP= 2
EN_PUMP_ECOST= 21
EN_PUMP_ECURVE= 20
EN_PUMP_EFFIC= 17
EN_PUMP_EPAT= 22
EN_PUMP_HCURVE= 19
EN_PUMP_POWER= 18
EN_PUMP_STATE= 16
EN_QTIME= 12
EN_QUALITY= 12
EN_QUALSTEP= 2
EN_RANGE= 4
EN_RELATIVEERROR= 1
EN_REPORTSTART= 6
EN_REPORTSTEP= 5
EN_RESERVOIR= 1
EN_ROUGHNESS= 2
EN_RULE= 5
EN_RULECOUNT= 6
EN_RULESTEP= 7
EN_R_CLOCKTIME= 10
EN_R_DEMAND= 0
EN_R_DRAINTIME= 12
EN_R_FILLTIME= 11
EN_R_FLOW= 5
EN_R_GRADE= 2
EN_R_HEAD= 1
EN_R_IS_ACTIVE= 3
EN_R_IS_CLOSED= 2
EN_R_IS_OPEN= 1
EN_R_LEVEL= 3
EN_R_LINK= 7
EN_R_NODE= 6
EN_R_POWER= 8
EN_R_PRESSURE= 4
EN_R_SETTING= 7
EN_R_STATUS= 6
EN_R_SYSTEM= 8
EN_R_TIME= 9
EN_SAVE= 1
EN_SAVE_AND_INIT= 11
EN_SETPOINT= 2
EN_SETTING= 12
EN_SOURCEMASS= 13
EN_SOURCEPAT= 6
EN_SOURCEQUAL= 5
EN_SOURCETYPE= 7
EN_SP_DIFFUS= 18
EN_SP_GRAVITY= 12
EN_SP_VISCOS= 13
EN_STARTTIME= 10
EN_STATISTIC= 8
EN_STATUS= 11
EN_TANK= 2
EN_TANKCOUNT= 1
EN_TANKDIAM= 17
EN_TANKLEVEL= 8
EN_TANKORDER= 21
EN_TANKVOLUME= 24
EN_TANK_KBULK= 23
EN_TCV= 7
EN_TIMEOFDAY= 3
EN_TIMEPAT= 2
EN_TIMER= 2
EN_TOLERANCE= 2
EN_TRACE= 3
EN_TRIALS= 0
EN_UNBALANCED= 14
EN_VELOCITY= 9
EN_VOLCURVE= 19
EN_WALLORDER= 20
MSX_BULK= 0
MSX_CONCEN= 0
MSX_CONSTANT= 6
MSX_FLOWPACED= 3
MSX_LINK= 1
MSX_MASS= 1
MSX_NODE= 0
MSX_NOSOURCE= -1
MSX_PARAMETER= 5
MSX_PATTERN= 7
MSX_SETPOINT= 2
MSX_SPECIES= 3
MSX_TANK= 2
MSX_TERM= 4
MSX_WALL= 1
classepyt.epanet.epanet(*argv, version=2.2, ph=False, loadfile=False, customlib=None, display_msg=True, display_warnings=True)[source]
Bases: error_handler

EPyt main functions class

Example with custom library
epanetlib=os.path.join(os.getcwd(), ‘epyt’,’libraries’,’win’,’epanet2.dll’) d = epanet(inpname, msx=True,customlib=epanetlib)

addControls(control, *argv)[source]
Adds a new simple control.

Parameters
:
control (float or list) – New Control

Returns
:
Control index

Return type
:
int

The examples are based on d = epanet(‘Net1.inp’)

Example 1: Close Link 12 if the level in Tank 2 exceeds 20 ft.

index = d.addControls('LINK 12 CLOSED IF NODE 2 ABOVE 20')
d.getControls(index).disp()
Example 2: Open Link 12 if the pressure at Node 11 is under 30 psi.

index = d.addControls('LINK 12 OPEN IF NODE 11 BELOW 30')
d.getControls(index).disp()
Example 3: Pump 9 speed is set to 1.5 at 16 hours or 57600 seconds into the simulation.

index = d.addControls('LINK 9 1.5 AT TIME 16:00')
d.getControls(index).disp()
index = d.addControls('LINK 9 1.5 AT TIME 57600') #in seconds
d.getControls(index).disp()
Example 4: Link 12 is closed at 10 am and opened at 8 pm throughout the simulation.

index_3 = d.addControls('LINK 12 CLOSED AT CLOCKTIME 10:00')
d.getControls(index_3).disp()
index_4 = d.addControls('LINK 12 OPEN AT CLOCKTIME 20:00')
d.getControls(index_4).disp()
Example 5: Adds multiple controls given as cell.

d = epanet("Net1.inp")
control_1 = 'LINK 9 OPEN IF NODE 2 BELOW 110'
control_2 = 'LINK 9 CLOSED IF NODE 2 ABOVE 200'
controls = [control_1, control_2]
index = d.addControls(controls)
d.getControls(index)[0].Control
d.getControls(index)[1].Control
Example 6:

Notes:
index: return index of the new control.

Type: the type of control to add (see EN_ControlType).

linkIndex: the index of a link to control (starting from 1).

setting: control setting applied to the link.

nodeIndex: index of the node used to control the link

(0 for EN_TIMER and EN_TIMEOFDAY controls). * level: action level (tank level, junction pressure, or time in seconds) that triggers the control.

Control type codes consist of the following:
EN_LOWLEVEL 0 Control applied when tank level or node

pressure drops below specified level * EN_HILEVEL 1 Control applied when tank level or node pressure rises above specified level * EN_TIMER 2 Control applied at specific time into simulation * EN_TIMEOFDAY 3 Control applied at specific time of day

Code example: index = d.addControls(type, linkIndex, setting, nodeIndex, level)

index = d.addControls(0, 13, 0, 11, 100)
# retrieve controls of index in dict format
d.getControls(index).to_dict()
See also deleteControls, getControls, setControls, getControlRulesCount.

addCurve(*argv)[source]
Adds a new curve appended to the end of the existing curves. Returns the new curve’s index.

Parameters
:
*argv –

value index or value

Raises
:
No curve ID or curve values exist

Returns
:
new curve valueIndex

Return type
:
int

Example: ID selected without a space in between the letters

new_curve_ID = 'NewCurve'
x_y_1 = [0, 730]
x_y_2 = [1000, 500]
x_y_3 = [1350, 260]
# X and Y values selected
values = [x_y_1, x_y_2, x_y_3]
# New curve added
curve_index = d.addCurve(new_curve_ID, values)
# Retrieves all the info of curves
d.getCurvesInfo().disp()
See also getCurvesInfo, getCurveType, setCurve,setCurveValue, setCurveNameID, setCurveComment.

addLinkPipe(pipeID, fromNode, toNode, *argv)[source]
Adds a new pipe. Returns the index of the new pipe.

Properties that can be set(optional):
Length

Diameter

Roughness Coefficient

Minor Loss Coefficient

If no properties are given, the default values are:
length = 330 feet (~100.5 m)

diameter = 10 inches (25.4 cm)

roughness coefficient = 130 (Hazen-Williams formula) or
0.15 mm (Darcy-Weisbach formula) or 0.01 (Chezy-Manning formula)

minor Loss Coefficient = 0

The examples are based on d = epanet(“Net1.inp”)

Example 1: Adds a new pipe given no properties.

pipeID = 'newPipe_1'
fromNode = '10'
toNode = '21'
# Retrieves the number of links
d.getLinkPipeCount()
pipeIndex = d.addLinkPipe(pipeID, fromNode, toNode)
d.getLinkPipeCount()
d.plot()
Example 2: Adds a new pipe given it’s length.

pipeID = 'newPipe_2'
fromNode = '11'
toNode = '22'
length = 600
d.getLinkPipeCount()
pipeIndex = d.addLinkPipe(pipeID, fromNode, toNode, length)
d.getLinkPipeCount()
# Retrieves the new link's length
d.getLinkLength(pipeIndex)
d.plot()
Example 3: Adds a new pipe given it’s length, diameter, roughness coefficient and minor loss coefficient.

pipeID = 'newPipe_3'
fromNode = '31'
toNode = '22'
length = 500
diameter = 15
roughness = 120
minorLossCoeff = 0.2
d.getLinkPipeCount()
pipeIndex = d.addLinkPipe(pipeID, fromNode, toNode, length,
                          diameter, roughness, minorLossCoeff)
d.getLinkPipeCount()
d.getLinkLength(pipeIndex)
# Retrieves the new link's diameter
d.getLinkDiameter(pipeIndex)
# Retrieves the new link's roughness coefficient
d.getLinkRoughnessCoeff(pipeIndex)
# Retrieves the new link's minor loss coefficient
d.getLinkMinorLossCoeff(pipeIndex)
d.plot()
See also plot, setLinkNodesIndex, addLinkPipeCV, addNodeJunction, deleteLink, setLinkDiameter.

addLinkPipeCV(cvpipeID, fromNode, toNode, *argv)[source]
Adds a new control valve pipe. Returns the index of the new control valve pipe.

Properties that can be set(optional):
Length

Diameter

Roughness Coefficient

Minor Loss Coefficient

If no properties are given, the default values are:
length = 330 feet (~100.5 m)

diameter = 10 inches (25.4 cm)

roughness coefficient = 130 (Hazen-Williams formula) or
0.15 mm (Darcy-Weisbach formula) or 0.01 (Chezy-Manning formula)

minor Loss Coefficient = 0

The examples are based on d = epanet(‘Net1.inp’)

Example 1: Adds a new control valve pipe given no properties.

cvPipeID = 'newCVPipe_1'
fromNode = '10'
toNode = '21'
# Retrieves the number of pipes
d.getLinkPipeCount()
cvPipeIndex = d.addLinkPipeCV(cvPipeID, fromNode, toNode)
d.getLinkPipeCount()
# Plots the network in a new figure
d.plot()
Example 2: Adds a new control valve pipe given it’s length.

cvPipeID = 'newCVPipe_2'
fromNode = '11'
toNode = '22'
length = 600
d.getLinkPipeCount()
cvPipeIndex = d.addLinkPipeCV(cvPipeID, fromNode, toNode, length)
d.getLinkPipeCount()
# Retrieves the new link's length
d.getLinkLength(cvPipeIndex)
d.plot()
Example 3: Adds a new control valve pipe given it’s length, diameter, roughness coefficient and minor loss coefficient.

cvPipeID = 'newCVPipe_3'
fromNode = '31'
toNode = '22'
length = 500
diameter = 15
roughness = 120
minorLossCoeff = 0.2
d.getLinkPipeCount()
cvPipeIndex = d.addLinkPipeCV(cvPipeID, fromNode, toNode, length,
                              diameter, roughness, minorLossCoeff)
d.getLinkPipeCount()
d.getLinkLength(cvPipeIndex)
# Retrieves the new link's diameter
d.getLinkDiameter(cvPipeIndex)
# Retrieves the new link's roughness coefficient
d.getLinkRoughnessCoeff(cvPipeIndex)
# Retrieves the new link's minor loss coefficient
d.getLinkMinorLossCoeff(cvPipeIndex)
d.plot()
See also plot, setLinkNodesIndex, addLinkPipe, addNodeJunction, deleteLink, setLinkDiameter.

addLinkPump(pumpID, fromNode, toNode, *argv)[source]
Adds a new pump. Returns the index of the new pump.

Parameters
pumpIDstring
Pump ID.

fromNodenumeric
Starting node.

toNodenumeric
End node.

Returns
indexnumeric
new Pumps index

Properties that can be set(optional):
Initial Status

Initial Speed setting

Power

Pattern index

If no properties are given, the default values are:
initial status = 1 (OPEN)

initial speed setting = 1

power = 0

pattern index = 0

Examples
The examples are based on d = epanet(‘Net1.inp’)

Example 1: Adds a new pump given no properties.

pumpID = 'newPump_1'
fromNode = '10'
toNode = '21'
# Retrieves the number of pumps
d.getLinkPumpCount()
pumpIndex = d.addLinkPump(pumpID, fromNode, toNode)
d.getLinkPumpCount()
# Plots the network in a new figure
d.plot()
Example 2: Adds a new pump given it’s initial status.:

pumpID = 'newPump_2'
fromNode = '31'
toNode = '22'
initialStatus = 0    # (CLOSED)
d.getLinkPumpCount()
pumpIndex = d.addLinkPump(pumpID, fromNode, toNode, initialStatus)
d.getLinkPumpCount()
# Retrieves the new pump’s initial status >>> d.getLinkInitialStatus(pumpIndex) >>> d.plot()

Example 3: Adds a new pump given it’s initial status, initial speed setting, power and pattern index.

pumpID = 'newPump_3'
fromNode = '11'
toNode = '22'
initialStatus = 1    # (OPEN)
initialSetting = 1.2
power = 10
patternIndex = 1
d.getLinkPumpCount()
pumpIndex = d.addLinkPump(pumpID, fromNode, toNode, initialStatus,
                          initialSetting, power, patternIndex)
d.getLinkPumpCount()
d.getLinkInitialStatus(pumpIndex)
# Retrieves the new pump's initial setting
d.getLinkInitialSetting(pumpIndex)
# Retrieves the new pump's power
d.getLinkPumpPower(pumpIndex)
# Retrieves the new pump's pattern index
d.getLinkPumpPatternIndex(pumpIndex)
d.plot()
See also: plot, setLinkNodesIndex, addLinkPipe, addNodeJunction, deleteLink, setLinkInitialStatus.

addLinkValveFCV(vID, fromNode, toNode)[source]
Adds a new FCV valve. Returns the index of the new FCV valve.

The example is based on d = epanet(‘Net1.inp’)

Example:

valveID = 'newValveFCV'
fromNode = '10'
toNode = '21'
valveIndex = d.addLinkValveFCV(valveID, fromNode, toNode)
d.plot()
See also plot, setLinkNodesIndex, addLinkPipe,
addLinkValvePRV, deleteLink, setLinkTypeValveTCV.

addLinkValveGPV(vID, fromNode, toNode)[source]
Adds a new GPV valve. Returns the index of the new GPV valve.

The example is based on d = epanet(‘Net1.inp’)

Example:

valveID = 'newValveGPV'
fromNode = '10'
toNode = '21'
valveIndex = d.addLinkValveGPV(valveID, fromNode, toNode)
d.plot()
See also plot, setLinkNodesIndex, addLinkPipe,
addLinkValvePRV, deleteLink, setLinkTypeValveFCV.

addLinkValvePBV(vID, fromNode, toNode)[source]
Adds a new PBV valve. Returns the index of the new PBV valve.

The example is based on d = epanet(‘Net1.inp’)

Example:

valveID = 'newValvePBV'
fromNode = '10'
toNode = '21'
valveIndex = d.addLinkValvePBV(valveID, fromNode, toNode)
d.plot()
See also plot, setLinkNodesIndex, addLinkPipe,
addLinkValvePRV, deleteLink, setLinkTypeValvePRV.

addLinkValvePRV(vID, fromNode, toNode)[source]
Adds a new PRV valve. Returns the index of the new PRV valve.

# The example is based on d = epanet(‘Net1.inp’)

Example:

valveID = 'newValvePRV'
fromNode = '10'
toNode = '21'
valveIndex = d.addLinkValvePRV(valveID, fromNode, toNode)
d.plot()
See also plot, setLinkNodesIndex, addLinkPipe,
addLinkValvePSV, deleteLink, setLinkTypeValveFCV.

addLinkValvePSV(vID, fromNode, toNode)[source]
Adds a new PSV valve. Returns the index of the new PSV valve.

The example is based on d = epanet(‘Net1.inp’)

Example:

valveID = 'newValvePSV'
fromNode = '10'
toNode = '21'
valveIndex = d.addLinkValvePSV(valveID, fromNode, toNode)
d.plot()
See also plot, setLinkNodesIndex, addLinkPipe,
addLinkValvePRV, deleteLink, setLinkTypeValveGPV.

addLinkValveTCV(vID, fromNode, toNode)[source]
Adds a new TCV valve. Returns the index of the new TCV valve.

The example is based on d = epanet(‘Net1.inp’)

Example:

valveID = 'newValveTCV'
fromNode = '10'
toNode = '21'
valveIndex = d.addLinkValveTCV(valveID, fromNode, toNode)
d.plot()
See also plot, setLinkNodesIndex, addLinkPipe,
addLinkValvePRV, deleteLink, setLinkTypeValveFCV.

addMSXPattern(*args)[source]
Adds new time pattern

Example: d = epanet(‘net2-cl2.inp’); d.loadMSXFile(‘net2-cl2.msx’); print(d.getMSXPatternsNameID()) mult = [0.5, 0.8, 1.2, 1.0, 0.7, 0.3] d.addMSXPattern(‘Pattern1’, mult) print(d.getMSXPattern()) print(d.getMSXPatternsNameID())

See also getMSXPattern, setMSXPattern.

addNodeJunction(juncID, *argv)[source]
Adds new junction

Returns the index of the new junction.

The following data can be set(optional):
Coordinates

Elevation

Primary base demand

ID name of the demand’s time pattern

Example 1: Adds a new junction with the default coordinates (i.e. [0, 0]).

junctionID = 'newJunction_1'
junctionIndex = d.addNodeJunction(junctionID)
d.plot()
Example 2: Adds a new junction with coordinates [X, Y] = [20, 10].

junctionID = 'newJunction_2'
junctionCoords = [20, 10]
junctionIndex = d.addNodeJunction(junctionID, junctionCoords)
d.plot(highlightnode=junctionIndex)
Example 3: Adds a new junction with coordinates [X, Y] = [20, 20] and elevation = 500.

junctionID = 'newJunction_3'
junctionCoords = [20, 20]
junctionElevation = 500
junctionIndex = d.addNodeJunction(junctionID, junctionCoords,
                                  junctionElevation)
d.getNodeElevations(junctionIndex)
d.plot()
Example 4: Adds a new junction with coordinates [X, Y] = [10, 40], elevation = 500 and demand = 50.

junctionID = 'newJunction_4'
junctionCoords = [10, 40]
junctionElevation = 500
demand = 50
junctionIndex = d.addNodeJunction(junctionID, junctionCoords,
                                  junctionElevation, demand)
d.getNodeBaseDemands(junctionIndex)
d.plot()
Example 5: Adds a new junction with coordinates [X, Y] = [10, 20], elevation = 500, demand = 50 and pattern ID = the 1st time pattern ID(if exists).

junctionID = 'newJunction_5'
junctionCoords = [10, 20]
junctionElevation = 500
demand = 50
demandPatternID = d.getPatternNameID(1)
junctionIndex = d.addNodeJunction(junctionID, junctionCoords,
                                  junctionElevation, demand,
                                  demandPatternID)
d.getNodeDemandPatternNameID()[1][junctionIndex-1]
d.plot()
See also plot, setLinkNodesIndex, addNodeReservoir, setNodeComment, deleteNode, setNodeBaseDemands.

addNodeJunctionDemand(*argv)[source]
Adds a new demand to a junction given the junction index, base demand, demand time pattern and demand category name. Returns the values of the new demand category index. A blank string can be used for demand time pattern and demand name category to indicate that no time pattern or category name is associated with the demand.

Example 1: New demand added with the name ‘new demand’ to the 1st node, with 100 base demand, using the 1st time pattern.

d.addNodeJunctionDemand(1, 100, '1', 'new demand')
# Retrieves the indices of all demands for all nodes.
d.getNodeJunctionDemandIndex()
# Retrieves the demand category names of the 2nd demand index.
d.getNodeJunctionDemandName()[2]
Example 2: New demands added with the name ‘new demand’ to the 1st and 2nd node, with 100 base demand, using the 1st time pattern.

d.addNodeJunctionDemand([1, 2], 100, '1', 'new demand')
# Retrieves the indices of all demands for all nodes.
d.getNodeJunctionDemandIndex()
# Retrieves the demand category names of the 2nd demand index.
d.getNodeJunctionDemandName()[2]
Example 3: New demands added with the name ‘new demand’ to the 1st and 2nd node, with 100 and 110 base demand respectively, using the 1st time pattern.

d.addNodeJunctionDemand([1, 2], [100, 110], '1', 'new demand')
# Retrieves the indices of all demands for all nodes.
d.getNodeJunctionDemandIndex()
# Retrieves the demand category names of the 2nd demand index
d.getNodeJunctionDemandName()[2]     .
Example 4: New demands added with the name ‘new demand’ to the 1st and 2nd node, with 100 and 110 base demand respectively, using the 1st

time pattern.

d.addNodeJunctionDemand([1, 2], [100, 110], ['1', '1'],
                        'new demand')
# Retrieves the indices of all demands for all nodes.
d.getNodeJunctionDemandIndex()
# Retrieves the demand category names of the 2nd demand index.
d.getNodeJunctionDemandName()[2]
Example 5: New demands added with the names ‘new demand1’ and ‘new demand2’ to the 1st and 2nd node, with 100 and 110 base demand respectively, using the 1st and 2nd(if exists) time pattern respectively.

d.addNodeJunctionDemand([1, 2], [100, 110], ['1', '2'],
                        ['new demand1', 'new demand2'])
# Retrieves the indices of all demands for all nodes.
d.getNodeJunctionDemandIndex()
# Retrieves the demand category names of the 2nd demand index.
d.getNodeJunctionDemandName()[2]
See also deleteNodeJunctionDemand, getNodeJunctionDemandIndex,
getNodeJunctionDemandName, setNodeJunctionDemandName,
getNodeBaseDemands.
addNodeReservoir(resID, *argv)[source]
Adds a new reservoir. Returns the index of the new reservoir.

Example 1: Adds a new reservoir with the default coordinates (i.e. [0, 0])

reservoirID = 'newReservoir_1'
reservoirIndex = d.addNodeReservoir(reservoirID)
d.plot()
Example 2: Adds a new reservoir with coordinates [X, Y] = [20, 30].

reservoirID = 'newReservoir_2'
reservoirCoords = [20, 30]
reservoirIndex = d.addNodeReservoir(reservoirID, reservoirCoords)
d.plot()
See also plot, setLinkNodesIndex, addNodeJunction, self.addLinkPipe, deleteNode, setNodeBaseDemands.

addNodeTank(tankID, *argv)[source]
Adds a new tank. Returns the index of the new tank.

Example 1: Adds a new tank with the default coordinates (i.e. [0, 0])

tankID = 'newTank_1'
tankIndex = d.addNodeTank(tankID)
d.plot()
Example 2: Adds a new tank with coordinates [X, Y] = [10, 10]. >>> tankID = ‘newTank_2’ >>> tankCoords = [10, 10] >>> tankIndex = d.addNodeTank(tankID, tankCoords) >>> d.plot()

Example 3: Adds a new tank with coordinates [X, Y] = [20, 20] and elevation = 100.

tankID = 'newTank_3'
tankCoords = [20, 20]
elevation = 100
tankIndex = d.addNodeTank(tankID, tankCoords, elevation)
d.plot()
Example 4: Adds a new tank with coordinates [X, Y] = [20, 30], elevation = 100, initial level = 130, minimum water level = 110, maximum water level = 160, diameter = 60, minimum water volume = 200000, volume curve ID = ‘’.

tankID = 'newTank_4'
tankCoords = [20, 30]
elevation = 100
initialLevel = 130
minimumWaterLevel = 110
maximumWaterLevel = 160
diameter = 60
minimumWaterVolume = 200000
volumeCurveID = ''   # Empty for no curve
tankIndex = d.addNodeTank(tankID, tankCoords, elevation,
                          initialLevel, minimumWaterLevel,
                          maximumWaterLevel, diameter,
                          minimumWaterVolume, volumeCurveID)
t_data = d.getNodeTankData(tankIndex)
d.plot()
See also plot, setLinkNodesIndex, addNodeJunction, addLinkPipe, deleteNode, setNodeBaseDemands.

addPattern(*argv)[source]
Adds a new time pattern to the network.

Example 1:

# Retrieves the ID labels of time patterns >>> d.getPatternNameID() >>> patternID = ‘new_pattern’ # Adds a new time pattern given it’s ID >>> patternIndex = d.addPattern(patternID) >>> patternIndex = d.addPattern(patternID+’2’, 1) >>> d.getPatternNameID()

Example 2:

patternID = 'new_pattern'
patternMult = [1.56, 1.36, 1.17, 1.13, 1.08,
1.04, 1.2, 0.64, 1.08, 0.53, 0.29, 0.9, 1.11,
1.06, 1.00, 1.65, 0.55, 0.74, 0.64, 0.46,
0.58, 0.64, 0.71, 0.66]
# Adds a new time pattern given ID and the multiplier
patternIndex = d.addPattern(patternID, patternMult)
d.getPatternNameID()
d.getPattern()
See also getPattern, setPattern, setPatternNameID, setPatternValue, setPatternComment.

addRules(rule)[source]
Adds a new rule-based control to a project.

Note

Rule format: Following the format used in an EPANET input
file.

‘RULE ruleid

IF object objectid attribute relation
attributevalue

THEN object objectid
STATUS/SETTING IS value

PRIORITY value’

See more: ‘https://nepis.epa.gov/Adobe/PDF/P1007WWU.pdf’ (Page 164)

The example is based on d = epanet(‘Net1.inp’)

Example: >>> d.getRuleCount() >>> d.addRules(‘RULE RULE-1

IF TANK 2 LEVEL >= 140 THEN PUMP 9

            STATUS IS CLOSED 
PRIORITY 1’)
d.getRuleCount()
d.getRules()[1]['Rule']
See also deleteRules, setRules, getRules, getRuleInfo, setRuleThenAction, setRuleElseAction, setRulePriority.

appRotateNetwork(theta, indexRot=0)[source]
Rotates the network by theta degrees counter-clockwise, using as pivot the indexRot theta: angle in degrees to rotate the network counter-clockwise indexRot: index of the node/point to be rotated. If it’s not provided then the first index node is used as pivot.

Example 1: Rotate the network by 60 degrees counter-clockwise around the index 1 node. >>> d = epanet(‘Net1.inp’) >>> d.plot() >>> d.appRotateNetwork(60) >>> d.plot()

Example 2: Rotate the network by 150 degrees counter-clockwise around the reservoir with index 921. >>> d = epanet(‘ky10.inp’) >>> d.plot() >>> d.appRotateNetwork(150,921) >>> d.plot()

appShiftNetwork(xDisp, yDisp)[source]
Shifts the network by xDisp in the x-direction and by yDisp in the y-direction

Example 1: Shift the network by 1000 feet in the x-axis and -1000 feet in the y-axis

d = epanet('Net1.inp')
d.getNodeCoordinates(1) # old x coordinates
d.getNodeCoordinates(2) # old y coordinates
d.appShiftNetwork(1000,-1000)
d.getNodeCoordinates(1) # new x coordinates
d.getNodeCoordinates(2) # new y coordinates
Example 2: Shift the network,along with the vertices by 1000 feet in the x-axis and -1000 feet in the y-axis

d = epanet('ky10.inp')
d.appShiftNetwork(1000,-1000)
d.plot()
arange(begin, end, step=1)[source]
Create float number sequence

changeMSXOptions(param, change)[source]
clearReport()[source]
Clears the contents of a project’s report file.

Example:

d.clearReport()
See also writeReport, writeLineInReportFile, copyReport.

closeHydraulicAnalysis()[source]
Closes the hydraulic analysis system, freeing all allocated memory.

Example:

d.closeHydraulicAnalysis()
For more, you can type help getNodePressure and check examples 3 & 4.

See also openHydraulicAnalysis, saveHydraulicFile, closeQualityAnalysis.

closeNetwork()[source]
Closes down the Toolkit system.

Example:

d.closeNetwork()
See also loadEPANETFile, closeHydraulicAnalysis, closeQualityAnalysis.

closeQualityAnalysis()[source]
Closes the water quality analysis system, freeing all allocated memory.

Example:

d.closeQualityAnalysis()
For more, you can type help (d.epanet.getNodePressure) and check examples 3 & 4.

See also openQualityAnalysis, initializeQualityAnalysis, closeHydraulicAnalysis.

copyReport(fileName)[source]
Copies the current contents of a project’s report file to another file.

Example:

fileName = 'Report_copy'
d.copyReport(fileName)
See also writeReport, writeLineInReportFile, clearReport.

createProject()[source]
Creates a new epanet project

deleteAllTemps()[source]
Delete all temporary files (.inp, .bin) created in networks folder

deleteControls(*argv)[source]
Deletes an existing simple control.

Example 1:

# Retrieves the parameters of all controls >>> d.getControls() # Deletes the existing simple controls >>> d.deleteControls() >>> d.getControls()

Example 2:

# Adds a new simple control(index = 3) >>> index = d.addControls(‘LINK 9 43.2392 AT TIME 4:00:00’) >>> d.getControls(index) # Deletes the 3rd simple control >>> d.deleteControls(index) >>> d.getControls()

Example 3:

# Adds a new simple control(index = 3) >>> index_3 = d.addControls(‘LINK 9 43.2392 AT TIME 4:00:00’) # Adds a new simple control(index = 4) >>> index_4 = d.addControls(‘LINK 10 43.2392 AT TIME 4:00:00’) >>> d.getControls(index_3) >>> d.getControls(index_4) # Deletes the 3rd and 4th simple controls >>> d.deleteControls([index_3, index_4]) >>> d.getControls()

See also addControls, setControls, getControls, getControlRulesCount.

deleteCurve(idCurve)[source]
Deletes a data curve from a project.

Example 1:

d = epanet('BWSN_Network_1.inp')
# Retrieves the ID of the 1st curve
idCurve = d.getCurveNameID(1)
#  Deletes a curve given it's ID
d.deleteCurve(idCurve)
d.getCurveNameID()
Example 2:

index = 1
d.deleteCurve(index)             # Deletes a curve given it's index
d.getCurveNameID()
See also addCurve, setCurve, setCurveNameID, setCurveValue, setCurveComment.

deleteLink(idLink, *argv)[source]
Deletes a link.

condition = 0 | if is EN_UNCONDITIONAL: Deletes all controls and rules related to the object condition = 1 | if is EN_CONDITIONAL: Cancel object deletion if contained in controls and rules Default condition is 0.

Example 1:

# Retrieves the ID label of all links >>> d.getLinkNameID() # Retrieves the ID label of the 1st link >>> idLink = d.getLinkNameID(1) # Deletes the 1st link given it’s ID >>> d.deleteLink(idLink) >>> d.getLinkNameID()

Example 2:

idLink = d.getLinkPumpNameID(1)
condition = 1
# Attempts to delete a link contained in controls (error occurs)
d.deleteLink(idLink, condition)
Example 3:

indexLink = 1
# Deletes the 1st link given it's index
d.deleteLink(indexLink)
d.getLinkNameID()
See also addLinkPipe, deleteNode, deleteRules, setNodeCoordinates, setLinkPipeData.

deleteNode(idNode, *argv)[source]
Deletes nodes.

condition = 0 | if is EN_UNCONDITIONAL: Deletes all controls, rules and links related to the object condition = 1 | if is EN_CONDITIONAL: Cancel object deletion if contained in controls, rules and links Default condition is 0.

Example 1:

# Retrieves the total number of all nodes >>> d.getNodeCount() # Retrieves the ID label of the 1st node >>> idNode = d.getNodeNameID(1) # Deletes the 1st node given it’s ID >>> d.deleteNode(idNode) >>> d.getNodeCount()

Example 2:

idNode = d.getNodeNameID(1)
condition = 1
# Attempts to delete a node connected to links (error occurs)
d.deleteNode(idNode, condition)
Example 3:

index = 1
# Deletes the 1st node given it's index
d.deleteNode(index)
d.getNodeNameID()
Example 4:

idNodes = d.getNodeNameID([1,2])
d.getNodeCount()
# Deletes 2 nodes given their IDs
d.deleteNode(idNodes)
d.getNodeCount()
See also addNodeJunction, deleteLink, deleteRules, setNodeCoordinates, setNodeJunctionData.

deleteNodeJunctionDemand(*argv)[source]
Deletes a demand from a junction given the junction index and demand index. Returns the remaining(if exist) node demand indices.

Example 1:

nodeIndex = 1
baseDemand = 100
patternId = '1'
categoryIndex = 1
# Retrieves the indices of all demands for the 1st node
d.getNodeJunctionDemandIndex(nodeIndex)
# Retrieves the names of all nodes demand category
d.getNodeJunctionDemandName()
# Retrieves the name of the 1st demand category of the 1st node
d.getNodeJunctionDemandName()[categoryIndex][nodeIndex-1]
# Adds a new demand to the 1st node and returns the new
# demand index
categoryIndex = d.addNodeJunctionDemand(nodeIndex, baseDemand,
                                        patternId, 'new demand')
# Retrieves the indices of all demands for the 1st node
d.getNodeJunctionDemandIndex(nodeIndex)
# Retrieves the names of all nodes demand category
d.getNodeJunctionDemandName()
# Retrieves the name of the 2nd demand category of the 1st node
d.getNodeJunctionDemandName()[categoryIndex][nodeIndex-1]
# Deletes the 2nd demand of the 1st node
d.deleteNodeJunctionDemand(1, 2)
d.getNodeJunctionDemandIndex(nodeIndex)
Example 2:

nodeIndex = 1
baseDemand = 100
patternId = '1'
# Adds a new demand to the first node and returns the new demand index
categoryIndex_2 = d.addNodeJunctionDemand(nodeIndex,
                                          baseDemand,
                                          patternId,
                                          'new demand_2')
# Adds a new demand to the first node and returns the new demand index
categoryIndex_3 = d.addNodeJunctionDemand(nodeIndex,
                                          baseDemand,
                                          patternId,
                                          'new demand_3')
# Retrieves the name of the 2nd demand category of the 1st node
d.getNodeJunctionDemandName()[categoryIndex_2][nodeIndex-1]
# Deletes all the demands of the 1st node
d.deleteNodeJunctionDemand(1)
# Retrieves the indices of all demands for the 1st node
d.getNodeJunctionDemandIndex(nodeIndex)
Example 3:

nodeIndex = [1, 2, 3]
baseDemand = [100, 110, 150]
patternId = ['1', '1', '']
# Adds 3 new demands to the first 3 nodes
categoryIndex = d.addNodeJunctionDemand(nodeIndex, baseDemand,
                                        patternId, ['new demand_1',
                                        'new demand_2',
                                        'new demand_3'])
# Deletes all the demands of the first 3 nodes
d.getNodeJunctionDemandName()[2]
d.getNodeJunctionDemandIndex(nodeIndex)
d.deleteNodeJunctionDemand([1,2,3])
d.getNodeJunctionDemandIndex(nodeIndex)
See also addNodeJunctionDemand, getNodeJunctionDemandIndex, getNodeJunctionDemandName, setNodeJunctionDemandName, getNodeBaseDemands.

deletePattern(idPat)[source]
Deletes a time pattern from a project.

Example 1:

# Retrieves the ID of the 1st pattern >>> idPat = d.getPatternNameID(1) # Deletes the 1st pattern given it’s ID >>> d.deletePattern(idPat) >>> d.getPatternNameID()

Example 2:

index = 1
# Deletes the 1st pattern given it's index
d.deletePattern(index)
d.getPatternNameID()
See also deletePatternsAll, addPattern, setPattern, setPatternNameID, setPatternValue, setPatternComment.

deletePatternsAll()[source]
Deletes all time patterns from a project.

Example 1:

d.getPatternNameID()        # Retrieves the IDs of all the patterns
d.deletePatternsAll()       # Deletes all the patterns
d.getPatternNameID()
See also deletePattern, addPattern, setPattern, setPatternNameID, setPatternValue, setPadtternComment.

deleteProject()[source]
Deletes the epanet project

deleteRules(*argv)[source]
Deletes an existing rule-based control given it’s index. Returns error code.

The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example 1:

d.getRuleCount()        # Retrieves the number of rules
d.deleteRules()         # Deletes all the rule-based control
d.getRuleCount()
Example 2:

d.deleteRules(1)        # Deletes the 1st rule-based control
d.getRuleCount()
Example 3:

d.deleteRules([1,2,3])  # Deletes the 1st to 3rd rule-based control
d.getRuleCount()
See also addRules, getRules, setRules, getRuleCount().

getAdjacencyMatrix()[source]
Compute the adjacency matrix (connectivity graph) considering the flows, at different time steps or the mean flow, Compute the new adjacency matrix based on the mean flow in the network

getAllAttributes(obj)[source]
Get all attributes of a given Python object

Example:
filename = ‘Net1.inp’ #you can also try ‘net2-cl2.inp’, ‘Net3.inp’, etc. d = epanet(filename) Q = d.getComputedQualityTimeSeries() attr = d.getAllAttributes(Q) print(attr) #Will print Time, LinkQuality , NodeQuality and MassFlowRate

getCMDCODE()[source]
Retrieves the CMC code

getComputedHydraulicTimeSeries(matrix=True, *argv)[source]
Computes hydraulic simulation and retrieves all time-series.

Data that is computed:
Time 8) Velocity

Pressure 9) HeadLoss

Demand 10) Status

DemandDeficit 11) Setting

Head 12) Energy

TankVolume 13) Efficiency

Flow

Example 1:

# Retrieves all the time-series data >>> d.getComputedHydraulicTimeSeries()

Example 2:

# Retrieves all the time-series demands >>> d.getComputedHydraulicTimeSeries().Demand # Retrieves all the time-series flows >>> d.getComputedHydraulicTimeSeries().Flow

Example 3:

# Retrieves all the time-series Time, Pressure, Velocity >>> data = d.getComputedHydraulicTimeSeries([‘Time’, … ‘Pressure’, … ‘Velocity’]) >>> time = data.Time >>> pressure = data.Pressure >>> velocity = data.Velocity

See also getComputedQualityTimeSeries, getComputedTimeSeries.

getComputedQualityTimeSeries(*argv)[source]
Computes Quality simulation and retrieves all or some time-series.

Data that is computed:
Time

NodeQuality

LinkQuality

MassFlowRate

Example 1:

# Retrieves all the time-series data >>> d.getComputedQualityTimeSeries() Example 2:

# Retrieves all the time-series node quality >>> d.getComputedQualityTimeSeries().NodeQuality # Retrieves all the time-series link quality >>> d.getComputedQualityTimeSeries().LinkQuality

Example 3:

# Retrieves all the time-series Time, NodeQuality, LinkQuality >>> data = d.getComputedQualityTimeSeries([‘time’, … ‘nodequality’,

‘linkquality’])

time = data.Time
node_quality = data.NodeQuality
link_quality = data.LinkQuality
See also getComputedHydraulicTimeSeries, getComputedTimeSeries.

getComputedTimeSeries()[source]
Run analysis using .exe file

getComputedTimeSeries_ENepanet(tempfile=None, binfile=None, rptfile=None)[source]
Run analysis using ENepanet function

getConnectivityMatrix()[source]
Retrieve the Connectivity Matrix of the network

getControlRulesCount()[source]
Retrieves the number of controls.

Example:

d.getControlRulesCount()
See also getControls, getRuleCount.

getControls(*argv)[source]
Retrieves the parameters of all control statements.

The example is based on d = epanet(‘Net1.inp’)

Example :

# Retrieves the parameters of all control statements >>> d.getControls() # Retrieves the type of the 1st control >>> d.getControls(1).Type # Retrieves the ID of the link associated with the 1st control >>> d.getControls(1).LinkID # Retrieves the setting of the link associated with the 1st control >>> d.getControls(1).Setting # Retrieves the ID of the node associated with the 1st control >>> d.getControls(1).NodeID # Retrieves the value of the node associated with the 1st control >>> d.getControls(1).Value # Retrieves the 1st control statement >>> d.getControls(1).Control # Retrieves all the parameters of the first control statement in a dict >>> d.getControls(1).to_dict() # Retrieves the parameters of the first two control statements >>> d.getControls([1,2])

See also setControls, addControls, deleteControls, getRules, setRules, addRules, deleteRules.

getCounts()[source]
Retrieves the number of network components. Nodes, Links, Junctions, Reservoirs, Tanks, Pipes, Pumps, Valves, Curves, SimpleControls, RuleBasedControls, Patterns.

Example:

# Retrieves the number of all network components >>> counts = d.getCounts().to_dict() # Retrieves the number of nodes >>> d.getCounts().Nodes # Retrieves the number of simple controls >>> d.getCounts().SimpleControls

See also getNodeCount, getNodeJunctionCount, getLinkCount, getControlRulesCount.

getCurveComment(*argv)[source]
Retrieves the comment string of a curve.

Example 1:

# Retrieves the comment string assigned to all the curves >>> d.getCurveComment()

Example 2:

# Retrieves the comment string assigned to the 1st curve >>> d.getCurveComment(1)

Example 3:

# Retrieves the comment string assigned to the first 2 curves >>> d.getCurveComment([1,2])

See also getCurveNameID, getCurveType, getCurvesInfo

getCurveCount()[source]
Retrieves the number of curves.

Example:

d.getCurveCount()
See also getCurveIndex, getCurvesInfo.

getCurveIndex(*argv)[source]
Retrieves the index of a curve with specific ID.

Example 1:

# Retrieves the indices of all the curves >>> d.getCurveIndex()

Example 2:

# Retrieves the index of the 1st curve given it’s ID >>> curveID = d.getCurveNameID(1) >>> d.getCurveIndex(curveID)

Example 3:

# Retrieves the indices of the first 2 curves given their ID >>> curveID = d.getCurveNameID([1,2]) >>> d.getCurveIndex(curveID)

See also getCurveNameID, getCurvesInfo.

getCurveLengths(*argv)[source]
Retrieves number of points in a curve.

The examples are based on: d = epanet(‘Richmond_standard.inp’)

Example:

# Retrieves the number of points in all the curves >>> d.getCurveLengths() # Retrieves the number of points in the 1st curve >>> d.getCurveLengths(1) # Retrieves the number of points in the first 2 curves >>> d.getCurveLengths([1,2]) # Retrieves the number of points for curve with id = ‘1’ >>> d.getCurveLengths(‘1006’)

See also getCurvesInfo, setCurve.

getCurveNameID(*argv)[source]
Retrieves the IDs of curves.

Example:

# Retrieves the IDs of all the curves >>> d.getCurveNameID() # Retrieves the ID of the 1st curve >>> d.getCurveNameID(1) # Retrieves the IDs of the first 2 curves >>> d.getCurveNameID([1,2])

See also setCurveNameID, getCurvesInfo.

getCurveType(*argv)[source]
Retrieves the curve-type for all curves.

Example:

# Retrieves the curve-type for all curves >>> d.getCurveType() # Retrieves the curve-type for the 1st curve >>> d.getCurveType(1) # Retrieves the curve-type for the first 2 curves >>> d.getCurveType([1,2])

See also getCurveTypeIndex, getCurvesInfo.

getCurveTypeIndex(*argv)[source]
Retrieves the curve-type index for all curves.

Example:

# Retrieves the curve-type index for all curves >>> d.getCurveTypeIndex() # Retrieves the curve-type index for the 1st curve >>> d.getCurveTypeIndex(1) # Retrieves the curve-type index for the first 2 curves >>> d.getCurveTypeIndex([1,2])

See also getCurveType, getCurvesInfo.

getCurveValue(*argv)[source]
Retrieves the X, Y values of points of curves.

Example:

# Retrieves all the X and Y values of all curves >>> d.getCurveValue() >>> curveIndex = 1 # Retrieves all the X and Y values of the 1st curve >>> d.getCurveValue(curveIndex) >>> pointIndex = 1 # Retrieves the X and Y values of the 1st point of the 1st curve >>> d.getCurveValue(curveIndex, pointIndex)

See also setCurveValue, setCurve, getCurvesInfo.

getCurvesInfo()[source]
Retrieves all the info of curves.

Returns the following informations:
Curve Name ID

Number of points on curve

X values of points

Y values of points

Example:

d.getCurvesInfo().disp()
# Retrieves the IDs of curves
d.getCurvesInfo().CurveNameID
# Retrieves the number of points on curv
# # Retrieves the number of points on curvee
d.getCurvesInfo().CurveNvalue
# Retrieves the X values of points of all curves
d.getCurvesInfo().CurveXvalue
# Retrieves the X values of points of the 1st curve
d.getCurvesInfo().CurveXvalue[0]
# Retrieves the Y values of points of all curves
d.getCurvesInfo().CurveYvalue
# Retrieves the Y values of points of the 1st curve
d.getCurvesInfo().CurveYvalue[0]
See also setCurve, getCurveType, getCurveLengths, getCurveValue, getCurveNameID, getCurveComment.

getDemandModel()[source]
Retrieves the type of demand model in use and its parameters.

Demand model code DDA - 0, PDA - 1 Pmin - Pressure below Preq - Pressure required to deliver full demand. Pexp - Pressure exponent in demand function

Example:

model = d.getDemandModel()
See also setDemandModel, getNodeBaseDemands, getNodeDemandCategoriesNumber, getNodeDemandPatternIndex, getNodeDemandPatternNameID.

getENfunctionsImpemented()[source]
Retrieves the epanet functions that have been developed.

Example:

d.getENfunctionsImpemented()
See also getLibFunctions, getVersion.

getEquations()[source]
getError(Errcode)[source]
Retrieves the text of the message associated with a particular error or warning code.

Example:

error = 250
d.getError(error)
getFlowUnits()[source]
Retrieves flow units used to express all flow rates.

Example:

d.getFlowUnits()
getLibFunctions()[source]
Retrieves the functions of DLL.

Example:

d.getLibFunctions()
See also getENfunctionsImpemented, getVersion.

getLinkActualQuality(*argv)[source]
Retrieves the current computed link quality (read only).

Example:

d.getLinkActualQuality()        # Retrieves the current computed link quality for all links
d.getLinkActualQuality(1)       # Retrieves the current computed link quality for the first link
Note

check epyt/examples/EX14_hydraulic_and_quality_analysis.py

See also getLinkFlows, getLinkStatus, getLinkPumpState, getLinkSettings, getLinkPumpEfficiency.

getLinkBulkReactionCoeff(*argv)[source]
Retrieves the value of all link bulk chemical reaction coefficient.

Example:

d.getLinkBulkReactionCoeff() # Retrieves the value of all link bulk chemical reaction coefficient
# Retrieves the value of the first link bulk chemical reaction coefficient
d.getLinkBulkReactionCoeff(1)
See also getLinkType, getLinksInfo, getLinkRoughnessCoeff, getLinkMinorLossCoeff, getLinkInitialStatus, getLinkInitialSetting, getLinkWallReactionCoeff.

getLinkComment(*argv)[source]
Retrieves the comment string assigned to the link object.

Example 1:

# Retrieves the comments of all links >>> d.getLinkComment()

Example 2:

linkIndex = 1
# Retrieves the comment of the 1st link
d.getLinkComment(linkIndex)
Example 3:

linkIndex = [1,2,3,4,5]
# Retrieves the comments of the first 5 links
d.getLinkComment(linkIndex)
See also setLinkComment, getLinkNameID, getLinksInfo.

getLinkCount()[source]
Retrieves the number of links.

Example:

d.getLinkCount()
See also getLinkIndex, getNodeCount.

getLinkDiameter(*argv)[source]
Retrieves the value of link diameters. Pipe/valve diameter

Example 1:

# Retrieves the value of all link diameters >>> d.getLinkDiameter() # Retrieves the value of the first link diameter >>> d.getLinkDiameter(1) # Retrieves the value of the second and third link diameter >>> d.getLinkDiameter([1,2])

See also getLinkType, getLinksInfo, getLinkLength, getLinkRoughnessCoeff, getLinkMinorLossCoeff.

getLinkEnergy(*argv)[source]
Retrieves the current computed pump energy usage (read only).

Using step-by-step hydraulic analysis,

Example:

d.getLinkEnergy()        # Retrieves the current computed pump energy usage for all links
d.getLinkEnergy(1)       # Retrieves the current computed pump energy usage for the first link
For more, you can check examples 3 & 4 of getLinkFlows function

See also getLinkFlows, getLinkVelocity, getLinkHeadloss, getLinkStatus, getLinkPumpState, getLinkPumpEfficiency.

getLinkFlows(*argv)[source]
Retrieves the current computed flow rate (read only). Using step-by-step hydraulic analysis

Example 1:

d.getLinkFlows()        # Retrieves the current computed flow rate for all links
Example 2:

d.getLinkFlows(1)       # Retrieves the current computed flow rate for the first link
Example 3: Hydraulic analysis step-by-step.

d.openHydraulicAnalysis()
d.initializeHydraulicAnalysis()
tstep, P, T_H, D, H, F, S =1, [], [], [], [], [], []
while tstep>0:
    t = d.runHydraulicAnalysis()
    P.append(d.getNodePressure())
    D.append(d.getNodeActualDemand())
    H.append(d.getNodeHydraulicHead())
    S.append(d.getLinkStatus())
    F.append(d.getLinkFlows())
    T_H.append(t)
    tstep=d.nextHydraulicAnalysisStep()
d.closeHydraulicAnalysis()
Example 4: Hydraulic and Quality analysis step-by-step

d.openHydraulicAnalysis()
d.openQualityAnalysis()
d.initializeHydraulicAnalysis(0)
d.initializeQualityAnalysis(d.ToolkitConstants.EN_NOSAVE)
tstep, T, P, F, QN, QL = 1, [], [], [], [], []
while (tstep>0):
    t  = d.runHydraulicAnalysis()
    qt = d.runQualityAnalysis()
    P.append(d.getNodePressure())
    F.append(d.getLinkFlows())
    QN.append(d.getNodeActualQuality())
    QL.append(d.getLinkActualQuality())
    T.append(t)
    tstep = d.nextHydraulicAnalysisStep()
    qtstep = d.nextQualityAnalysisStep()
d.closeQualityAnalysis()
d.closeHydraulicAnalysis()
See also getLinkVelocity, getLinkHeadloss, getLinkStatus, getLinkPumpState, getLinkSettings, getLinkEnergy, getLinkActualQuality, getLinkPumpEfficiency.

getLinkHeadloss(*argv)[source]
Retrieves the current computed head loss (read only).

Using step-by-step hydraulic analysis,

Example :

d.getLinkHeadloss()      # Retrieves the current computed head loss for all links
d.getLinkHeadloss(1)     # Retrieves the current computed head loss for the first link
For more, you can check examples 3 & 4 of getLinkFlows function

See also getLinkFlows, getLinkVelocity, getLinkStatus, getLinkPumpState, getLinkSettings, getLinkActualQuality.

getLinkIndex(*argv)[source]
Retrieves the indices of all links, or the indices of an ID set of links.

Example 1:

d.getLinkIndex()                # Retrieves the indices of all links
Example 2:

linkID = d.getLinkNameID()
d.getLinkIndex(linkID)          # Retrieves the index of the 1st link given it's ID
Example 3:

linkID = d.getLinkNameID([1,2,3])
d.getLinkIndex(linkID)          # Retrieves the indices of the first 3 links given their ID
See also getLinkNameID, getLinkPipeIndex, getNodeIndex.

getLinkInitialSetting(*argv)[source]
Retrieves the value of all link roughness for pipes or initial speed for pumps or initial setting for valves.

Example:

# Retrieves the value of all link initial settings >>> d.getLinkInitialSetting() # Retrieves the value of the first link initial setting >>> d.getLinkInitialSetting(1)

See also getLinkType, getLinksInfo, getLinkInitialStatus, getLinkBulkReactionCoeff, getLinkWallReactionCoeff.

getLinkInitialStatus(*argv)[source]
Retrieves the value of all link initial status. Initial status (see @ref EN_LinkStatusType)

Example :

# Retrieves the value of all link initial status >>> d.getLinkInitialStatus() # Retrieves the value of the first link initial status >>> d.getLinkInitialStatus(1)

See also getLinkType, getLinksInfo, getLinkInitialSetting, getLinkBulkReactionCoeff, getLinkWallReactionCoeff.

getLinkLength(*argv)[source]
Retrieves the value of link lengths. Pipe length

Example:

# Retrieves the value of all link lengths >>> d.getLinkLength() # Retrieves the value of the first link length >>> d.getLinkLength(1)

See also getLinkType, getLinksInfo, getLinkDiameter, getLinkRoughnessCoeff, getLinkMinorLossCoeff.ughnessCoeff, getLinkMinorLossCoeff.

getLinkMinorLossCoeff(*argv)[source]
Retrieves the value of link minor loss coefficients. Pipe/valve minor loss coefficient

Example:

# Retrieves the value of all link minor loss coefficients >>> d.getLinkMinorLossCoeff() # Retrieves the value of the first link minor loss coefficient >>> d.getLinkMinorLossCoeff(1)

See also getLinkType, getLinksInfo, getLinkDiameter, getLinkLength, getLinkRoughnessCoeff.

getLinkNameID(*argv)[source]
Retrieves the ID label(s) of all links, or the IDs of an index set of links.

Example 1:

# Retrieves the ID’s of all links >>> d.getLinkNameID()

Example 2:

linkIndex = 1
# Retrieves the ID of the link with index = 1
d.getLinkNameID(linkIndex)
Example 3:

linkIndices = [1,2,3]
# Retrieves the IDs of the links with indices = 1, 2, 3
d.getLinkNameID(linkIndices)
See also getNodeNameID, getLinkPipeNameID, getLinkIndex.

getLinkNodesIndex(*argv)[source]
Retrieves the indexes of the from/to nodes of all links.

Example:

d.getLinkNodesIndex() d.getLinkNodesIndex(2) # Link index

See also getNodesConnectingLinksID.

getLinkPipeCount()[source]
Retrieves the number of pipes.

Example:

d.getLinkPipeCount()
See also getLinkPumpCount, getLinkCount.

getLinkPipeIndex()[source]
Retrieves the pipe indices.

Example:

d.getLinkPipeIndex()
See also getLinkIndex, getLinkPumpIndex.

getLinkPipeNameID(*argv)[source]
Retrieves the pipe ID.

Example:

d.getLinkPipeNameID()         # Retrieves the ID's of all pipes
d.getLinkPipeNameID(1)        # Retrieves the ID of the 1st pipe
d.getLinkPipeNameID([1,2,3])  # Retrieves the ID of the first 3 pipes
See also getLinkNameID, getLinkPumpNameID, getNodeNameID.

getLinkPumpCount()[source]
Retrieves the number of pumps.

Example:

d.getLinkPumpCount()
See also getLinkPipeCount, getLinkCount.

getLinkPumpECost(*argv)[source]
Retrieves the pump average energy price.

Example 1: Retrieves the average energy price of all pumps

d.getLinkPumpECost()
Example 2: Retrieves the average energy price of the 1st pump

d.getLinkPumpECost(1)
Example 3:

d = epanet('Richmond_standard.inp')
pIndex = 950
pIndices = d.getLinkPumpIndex()
# Retrieves the average energy price of the pump with link index 950
d.getLinkPumpECost(pIndex)
See also setLinkPumpECost, getLinkPumpPower, getLinkPumpHCurve, getLinkPumpEPat, getLinkPumpPatternIndex, getLinkPumpPatternNameID.

getLinkPumpECurve(*argv)[source]
Retrieves the pump efficiency v. flow curve index.

Example 1: Retrieves the efficiency v. flow curve index of all pumps

d.getLinkPumpECurve()
Example 2: Retrieves the efficiency v. flow curve index of the 1st pump

d.getLinkPumpECurve(1)
Example 3: Retrieves the efficiency v. flow curve index of the first 2 pumps

d.getLinkPumpECurve([1,2])
Example 4: Retrieves the efficiency v. flow curve index of the pumps with link index 950

d = epanet('Richmond_standard.inp')
pIndex = 950
pIndices = d.getLinkPumpIndex()
d.getLinkPumpECurve(pIndex)
See also setLinkPumpECurve, getLinkPumpHCurve, getLinkPumpECost, getLinkPumpEPat, getLinkPumpPatternIndex, getLinkPumpPatternNameID.

getLinkPumpEPat(*argv)[source]
Retrieves the pump energy price time pattern index.

Example 1: Retrieves the energy price time pattern index of all pumps

d.getLinkPumpEPat()
Example 2: Retrieves the energy price time pattern index of the 1st pump

d.getLinkPumpEPat(1)
Example 3: Retrieves the energy price time pattern index of the first 2 pumps

d.getLinkPumpEPat([1,2])
Example 4: Retrieves the energy price time pattern index of pump with link index 950

d = epanet('Richmond_standard.inp')
pIndex = 950
pIndices = d.getLinkPumpIndex()
d.getLinkPumpEPat(pIndex)
See also setLinkPumpEPat, getLinkPumpHCurve, getLinkPumpECurve, getLinkPumpECost, getLinkPumpPatternIndex, getLinkPumpPatternNameID.

getLinkPumpEfficiency(*argv)[source]
Retrieves the current computed pump efficiency (read only).

Example:

d.getLinkPumpEfficiency()  # Retrieves the current computed pump efficiency for all links
# Retrieves the current computed pump efficiency for the first link
d.getLinkPumpEfficiency(1)
See also getLinkFlows, getLinkStatus, getLinkPumpState, getLinkSettings, getLinkEnergy, getLinkActualQuality.

getLinkPumpHCurve(*argv)[source]
Retrieves the pump head v. flow curve index.

Example 1: Retrieves the head v. flow curve index of all pumps

d.getLinkPumpHCurve()
Example 2: Retrieves the head v. flow curve index of the 1st pump

d.getLinkPumpHCurve(1)
Example 3: Retrieves the head v. flow curve index of the first 2 pumps

d.getLinkPumpHCurve([1,2])
Example 4: Retrieves the head v. flow curve index of pump with link index 950

d = epanet('Richmond_standard.inp')
pIndex = 950
pIndices = d.getLinkPumpIndex()
d.getLinkPumpHCurve(pIndex)
See also setLinkPumpHCurve, getLinkPumpECurve, getLinkPumpECost, getLinkPumpEPat, getLinkPumpPatternIndex, getLinkPumpPatternNameID.

getLinkPumpHeadCurveIndex()[source]
Retrieves the index of a head curve for all pumps.

Example:

[curveIndex, pumpIndex] = d.getLinkPumpHeadCurveIndex()
See also getLinkPumpHCurve, getLinkPumpECurve.

getLinkPumpIndex(*argv)[source]
Retrieves the pump indices.

Example 1:

d.getLinkPumpIndex()          # Retrieves the indices of all pumps
Example 2:

d.getLinkPumpIndex(1)         # Retrieves the index of the 1st pump
Example 3:

d = epanet('Richmond_standard.inp')
d.getLinkPumpIndex([1,2])     # Retrieves the indices of the first 2 pumps
See also getLinkIndex, getLinkPipeIndex, getLinkValveIndex.

getLinkPumpNameID(*argv)[source]
Retrieves the pump ID.

Example 1:

d.getLinkPumpNameID()          # Retrieves the ID's of all pumps
Example 2:

d.getLinkPumpNameID(1)         # Retrieves the ID of the 1st pump
Example 3:

d = epanet('Net3_trace.inp')
d.getLinkPumpNameID([1,2])     # Retrieves the ID of the first 2 pumps
See also getLinkNameID, getLinkPipeNameID, getNodeNameID.

getLinkPumpPatternIndex(*argv)[source]
Retrieves the pump speed time pattern index.

Example 1: Retrieves the speed time pattern index of all pumps

d.getLinkPumpPatternIndex()
Example 2: Retrieves the speed time pattern index of the 1st pump

d.getLinkPumpPatternIndex(1)
Example 3: Retrieves the speed time pattern index of the first 2 pumps

d.getLinkPumpPatternIndex([1,2])
Example 4: Retrieves the speed time pattern index of the pumps given their indices

pumpIndex = d.getLinkPumpIndex()
d.getLinkPumpPatternIndex(pumpIndex)
See also setLinkPumpPatternIndex, getLinkPumpPower, getLinkPumpHCurve, getLinkPumpECost, getLinkPumpEPat, getLinkPumpPatternNameID.

getLinkPumpPatternNameID(*argv)[source]
Retrieves pump pattern name ID. A value of 0 means empty

Example 1: Retrieves the pattern name ID of all pumps

d = epanet('ky10.inp')
d.getLinkPumpPatternNameID()
Example 2: Retrieves the pattern name ID of the 1st pump

d.getLinkPumpPatternNameID(1)
Example 3: Retrieves the pattern name ID of the first 2 pumps

d.getLinkPumpPatternNameID([1,2])
Example 4: Retrieves the pattern name ID of the pumps given their indices

pumpIndex = d.getLinkPumpIndex()
d.getLinkPumpPatternNameID(pumpIndex)
See also getLinkPumpPower, getLinkPumpHCurve, getLinkPumpECurve, getLinkPumpECost, getLinkPumpEPat, getLinkPumpPatternIndex.

getLinkPumpPower(*argv)[source]
Retrieves the pump constant power rating (read only).

Example 1: Retrieves the constant power rating of all pumps

d.getLinkPumpPower()
Example 2: Retrieves the constant power rating of the 1st pump

d.getLinkPumpPower(1)
Example 3: Retrieves the constant power rating of the first 2 pumps

d.getLinkPumpPower([1,2])
Example 4: Retrieves the constant power rating of the pumps given their indices

pumpIndex = d.getLinkPumpIndex()
d.getLinkPumpPower(pumpIndex)
See also getLinkPumpHCurve, getLinkPumpECurve, getLinkPumpECost, getLinkPumpEPat, getLinkPumpPatternIndex, getLinkPumpPatternNameID.

getLinkPumpState(*argv)[source]
Retrieves the current computed pump state (read only) (see @ref EN_PumpStateType). same as status: open, active, closed Using step-by-step hydraulic analysis,

Example:

d.getLinkPumpState()        # Retrieves the current computed pump state for all links
d.getLinkPumpState(1)       # Retrieves the current computed pump state for the first link
For more, you can check examples 3 & 4 of getLinkFlows function

See also getLinkFlows, getLinkHeadloss, getLinkStatus, getLinkSettings, getLinkEnergy, getLinkPumpEfficiency.

getLinkPumpSwitches()[source]
Retrieves the number of pump switches.

Example:

d.getLinkPumpSwitches()
getLinkPumpType()[source]
Retrieves the type of a pump.

Example:

d.getLinkPumpType()
See also getLinkPumpTypeCode(), getLinkPumpPower.

getLinkPumpTypeCode()[source]
Retrieves the code of type of a pump.

Type of pump codes:
0 = Constant horsepower 1 = Power function 2 = User-defined custom curve

Example:

d.getLinkPumpTypeCode()         #  Retrieves the all the  pumps type code
d.getLinkPumpTypeCode()[0]      #  Retrieves the first pump type code
See also getLinkPumpType, getLinkPumpPower.

getLinkQuality(*argv)[source]
Retrieves the value of link quality. Pipe quality

Example 1:

# Retrieves the value of all link quality >>> d.getLinkQuality()

Example 2:

# Retrieves the value of the first link quality >>> d.getLinkQuality(1)

See also getLinkType, getLinksInfo, getLinkDiameter, getLinkRoughnessCoeff, getLinkMinorLossCoeff.

getLinkResultIndex(link_index)[source]
Retrieves the order in which a link’s results were saved to an output file.

Example:

link_index = 3
result_index = d.getLinkResultIndex(link_index)
See also getComputedHydraulicTimeSeries, deleteNode, getNodeResultIndex

getLinkRoughnessCoeff(*argv)[source]
Retrieves the value of link roughness coefficient. Pipe roughness coefficient

Example:

# Retrieves the value of all link roughness coefficients >>> d.getLinkRoughnessCoeff() # Retrieves the value of the first link roughness coefficient >>> d.getLinkRoughnessCoeff(1)

See also getLinkType, getLinksInfo, getLinkDiameter, getLinkLength, getLinkMinorLossCoeff.

getLinkSettings(*argv)[source]
Retrieves the current computed value of all link roughness for pipes or actual speed for pumps or actual setting for valves.

Using step-by-step hydraulic analysis,

Example:

d.getLinkSettings()      # Retrieves the current values of settings for all links
d.getLinkSettings(1)     # Retrieves the current value of setting for the first link
For more, you can check examples 3 & 4 of getLinkFlows function

See also getLinkFlows, getLinkVelocity, getLinkHeadloss, getLinkStatus, getLinkPumpState, getLinkEnergy.

getLinkStatus(*argv)[source]
Retrieves the current link status (see @ref EN_LinkStatusType) (0 = closed, 1 = open).

Using step-by-step hydraulic analysis,

Example:

d.getLinkStatus()        # Retrieves the current link status for all links
d.getLinkStatus(1)       # Retrieves the current link status for the first link
For more, you can check examples 3 & 4 of getLinkFlows function

See also getLinkFlows, getLinkVelocity, getLinkHeadloss, getLinkPumpState, getLinkSettings.

getLinkType(*argv)[source]
Retrieves the link-type code for all links.

Example 1:

# Retrieves the link-type code for all links >>> d.getLinkType()

Example 2:

# Retrieves the link-type code for the first link >>> d.getLinkType(1)

See also getLinkTypeIndex, getLinksInfo, getLinkDiameter, getLinkLength, getLinkRoughnessCoeff, getLinkMinorLossCoeff.

getLinkTypeIndex(*argv)[source]
Retrieves the link-type code for all links.

Example:

# Retrieves the link-type code for all links >>> d.getLinkTypeIndex() # Retrieves the link-type code for the first link >>> d.getLinkTypeIndex(1) # Retrieves the link-type code for the second and third links >>> d.getLinkTypeIndex([2,3])

See also getLinkType, getLinksInfo, getLinkDiameter, getLinkLength, getLinkRoughnessCoeff, getLinkMinorLossCoeff.

getLinkValveCount()[source]
Retrieves the number of valves.

Example:

d = epanet('BWSN_Network_1.inp')
d.getLinkValveCount()
See also getLinkPumpCount, getLinkCount.

getLinkValveIndex()[source]
Retrieves the valve indices.

Example:

d = epanet('ky10.inp')
d.getLinkValveIndex()
See also getLinkIndex, getLinkPipeIndex(), getLinkPumpIndex.

getLinkValveNameID(*argv)[source]
Retrieves the valve ID.

Example:

d = epanet('BWSN_Network_1.inp')
d.getLinkValveNameID()          # Retrieves the ID's of all valves
d.getLinkValveNameID(1)         # Retrieves the ID of the 1st valve
d.getLinkValveNameID([1,2,3])   # Retrieves the ID of the first 3 valves
See also getLinkNameID, getLinkPumpNameID, getNodeNameID.

getLinkVelocity(*argv)[source]
Retrieves the current computed flow velocity (read only).

Using step-by-step hydraulic analysis

Example 1:

d.getLinkVelocity()        # Retrieves the current computed flow velocity for all links
Example 2:

d.getLinkVelocity(1)       # Retrieves the current computed flow velocity for the first link
For more, you can check examples 3 & 4 of getLinkFlows function

See also getLinkFlows, getLinkHeadloss, getLinkStatus, getLinkPumpState, getLinkSettings, getLinkActualQuality.

getLinkVertices(*argv)[source]
Retrieves the coordinate’s of a vertex point assigned to a link.

The example is based on d = epanet(‘Net1.inp’)

Example:

linkID = '10'
x = [22, 24, 28]
y = [69, 68, 69]
d.setLinkVertices(linkID, x, y)
linkID = '112'
x = [10, 24, 18]
y = [49, 58, 60]
d.setLinkVertices(linkID, x, y)
d.getLinkVertices(1)
d.getLinkVertices(d.getLinkIndex('112'))
See also setLinkVertices, getLinkVerticesCount.

getLinkVerticesCount(*argv)[source]
Retrieves the number of internal vertex points assigned to a link.

Example 1:

d = epanet('Anytown.inp')
d.getLinkVerticesCount()          # Retrieves the vertices per link
Example 2:

d = epanet('ky10.inp')
link_id = 'P-10'
d.getLinkVerticesCount(link_id)   # Retrieves the vertices of link 'P-10'
Example 3:

link_index = 31
d.getLinkVerticesCount(link_index)    # Retrieves the vertices of link 31
See also getLinkVertices, setLinkVertices.

getLinkWallReactionCoeff(*argv)[source]
Retrieves the value of all pipe wall chemical reaction coefficient.

Example:

d.getLinkWallReactionCoeff()  # Retrieves the value of all pipe wall chemical reaction coefficient
# Retrieves the value of the first pipe wall chemical reaction coefficient
d.getLinkWallReactionCoeff(1)
See also getLinkType, getLinksInfo, getLinkRoughnessCoeff, getLinkMinorLossCoeff, getLinkInitialStatus, getLinkInitialSetting, getLinkBulkReactionCoeff.

getLinksInfo()[source]
Retrieves all link info.

Example:

linkInfo =  d.getLinksInfo().to_dict()        # get links info as a dict
linkInf  =  d.getLinksInfo()                  # get links info as object
linDiam  =  d.getLinksInfo().LinkDiameter     # get link diameters
See also getLinkType, getLinkTypeIndex, getLinkDiameter, getLinkLength, getLinkRoughnessCoeff, getLinkMinorLossCoeff.

getMSXAreaUnits()[source]
Retrieves Are units. Example:

d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXAreaUnits()

See also setMSXAreaUnits.

getMSXAtol()[source]
Retrieves the absolute tolerance.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXAtol()

See also getMSXRtol.

getMSXCompiler()[source]
Retrieves the chemistry function compiler code.

Compiler Options:
NONE: no compiler (default option) gc: MinGW or Gnu C++ compilers vc: Visual C++ compiler

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXCompiler()

See also setMSXCompilerNONE, setMSXCompilerVC,
setMSXCompilerGC.

getMSXComputedLinkQualitySpecie(node_indices, species_id)[source]
Returns the link quality for specific specie.

Example :
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) node_indices = [1,2,3,4] MSX_comp = d.getMSXComputedLinkQualitySpecie(node_indices, ‘CL2’) MSX_comp.LinkQuality row: time, col: node index MSX_comp.Time

Example wtih 2 species:
msx=d.getMSXComputedLinkQualitySpecie(x,[‘CL2’,”H”]) print(msx.LinkQuality)

See also getMSXComputedQualitySpecie, getMSXComputedNodeQualitySpecie.

getMSXComputedNodeQualitySpecie(node_indices, species_id)[source]
Returns the node quality for specific specie.

Example :
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) node_indices = [1,2,3] MSX_comp = d.getMSXComputedNodeQualitySpecie(node_indices, ‘CL2’) MSX_comp.NodeQuality row: time, col: node index MSX_comp.Time

Example wtih 2 species:
msx=d.getMSXComputedNodeQualitySpecie(x,[‘CL2’,”H”]) print(msx[“CL2”].NodeQuality)

See also getMSXComputedQualitySpecie, getMSXComputedLinkQualitySpecie.

getMSXComputedQualityLink(*args)[source]
Returns the computed quality for links. Example:

d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’)

MSX_comp = d.getMSXComputedQualityLink() x = MSX_comp.Quality y = MSX_comp.Time

getMSXComputedQualityNode(*args)[source]
Returns the computed quality for nodes. Example:

d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’)

MSX_comp = d.getMSXComputedQualityNode() x = MSX_comp.Quality y = MSX_comp.Time

getMSXComputedQualitySpecie(species=None, nodes=1, links=1)[source]
Returns the node/link quality for specific specie.

Example :
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) MSX_comp = d.getMSXComputedQualitySpecie([‘CL2’]) MSX_comp.NodeQuality row: time, col: node index MSX_comp.LinkQuality row: time, col: link index MSX_comp.Time

See also getMSXComputedQualityNode, getMSXComputedQualityLink.

getMSXConstantsCount()[source]
Retrieves the number of constants.

Example:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’) d.getMSXConstantsCount()

See also getMSXConstantsIndex, getMSXConstantsValue,
getMSXConstantsNameID.

getMSXConstantsIndex(*names)[source]
Return the MSX indices (1-based) of one or more constants.

Parameters
*namesstr | iterable[str], optional
Constant IDs to look up. • No arguments – return indices for all constants. • One iterable – its elements form the lookup list. • Several strings – those exact constant names.

Returns
list[int]
Indices in the same order the names were requested.

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’)

Examples:
d.getMSXConstantsIndex()             # all constants
d.getMSXConstantsIndex('S1')         # index of 'S1'
d.getMSXConstantsIndex('S1', 'S2')   # specific set
d.getMSXConstantsIndex(['S2', 'S1']) # iterable form
See also getMSXConstantsCount, getMSXConstantsValue,
getMSXConstantsNameID.

getMSXConstantsNameID(*ids)[source]
Return one or more MSX constant names by index.

Parameters
*idsint or iterable of int, optional
Indices (1-based) of the constants to retrieve. • If no ids are given, all constants are returned. • If the first and only positional argument is an iterable

(list/tuple/set), its contents are used as the index list.

Returns
list[str]
Constant names in the order requested.

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’)

Examples:
d.getMSXConstantsNameID()         # all constants
d.getMSXConstantsNameID(1)        # first constant
d.getMSXConstantsNameID(1, 2)     # constants 1, 2
d.getMSXConstantsNameID([1, 2])   # constants 1, 2
See also getMSXConstantsCount, getMSXConstantsValue,
getMSXConstantsNameID.

getMSXConstantsValue(*indices)[source]
Return the value of one or more MSX constants, addressed by index.

Parameters
*indicesint | iterable[int], optional
1-based constant indices. • No arguments → values for all constants. • One iterable → its items are the index list. • Several ints → those exact indices.

Returns
list[float]
Constant values, in the same order requested.

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’)

Examples:
d.getMSXConstantsValue()            # all constants
d.getMSXConstantsValue(1)           # constant 1
d.getMSXConstantsValue(1, 2)        # constants 1 and 2
d.getMSXConstantsValue([2, 1])   # iterable form
See also setMSXConstantsValue, getMSXConstantsCount,
getMSXConstantsIndex, getMSXConstantsNameID

getMSXCoupling()[source]
Retrieves the degree of coupling for solving DAE’s.

Coupling Options:
NONE: The solution to the algebraic equations is only updated
at the end of each integration time step.

FULL: The updating is done whenever a new set of values for the
rate-dependent variables in the reaction rate expressions is computed.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXCoupling()

See also setMSXCouplingFULL, setMSXCouplingNONE.

getMSXEquationsPipes()[source]
Retrieves equation for pipes.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXEquationsPipes()

See also getMSXEquationsTerms, getMSXEquationsTanks.

getMSXEquationsTanks()[source]
Retrieves equation for tanks.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXEquationsTanks()

See also getMSXEquationsTerms, getMSXEquationsPipes.

getMSXEquationsTerms()[source]
Retrieves equation terms.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXEquationsTerms()

See also getMSXEquationsPipes, getMSXEquationsTanks.

getMSXError(code)[source]
Retrieves the MSX erorr message for specific erorr code.

Example:
d.getMSXError(510)

getMSXLinkInitqualValue(*links)[source]
Return the initial-quality value for one or more links.

Parameters
*linksint | iterable[int], optional
1-based link indices. • No arguments → values for all links. • One iterable → its items are treated as the index list. • Several ints → those exact link indices.

Returns
list[list[float]]
Outer list follows the order requested; each inner list contains the initial-quality value for every species at that link (length = getMSXSpeciesCount()).

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’)

Examples:
d.getMSXLinkInitqualValue()             # every link
d.getMSXLinkInitqualValue(1)            # link 1
d.getMSXLinkInitqualValue(1, 3)         # links 1 and 3
d.getMSXLinkInitqualValue([2, 5, 7])    # iterable form
See also setMSXLinkInitqualValue

getMSXNodeInitqualValue(*nodes)[source]
Return the initial-quality values for one or more nodes.

Parameters
*nodesint or iterable of int, optional
1-based node indices. • No arguments → all nodes. • One iterable → the iterable’s contents are the node list. • Several ints → those specific nodes.

Returns
list[list[float]]
Outer list is in the same order requested; each inner list contains the species-quality values for that node.

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’)

Examples:
d.getMSXNodeInitqualValue()          # all nodes
d.getMSXNodeInitqualValue(1)         # node 1
d.getMSXNodeInitqualValue(1, 3, 7)   # nodes 1, 3, 7
d.getMSXNodeInitqualValue([2, 5])    # nodes 2 and 5
See also setMSXNodeInitqualValue.

getMSXOptions()[source]
Retrieves all the options.

Example:
d=epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXOptions()

getMSXParametersCount()[source]
Retrieves the number of parameters.

Example:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’) d.getMSXParametersCount()

See also setMSXParametersTanksValue, setMSXParametersPipesValue,
getMSXParametersIndex, getMSXParametersTanksValue, getMSXParametersPipesValue.

getMSXParametersIndex(*names)[source]
Return the MSX index of one or more parameters, looked up by name.

Parameters
*namesstr or iterable of str, optional
Parameter IDs (names) to look up. • Call with no arguments → all parameters are returned. • A single iterable → its contents are used as the name list. • Several strings → those exact names are looked up.

Returns
list[int]
Parameter indices, in the same order the names were requested.

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’)

Examples:
d.getMSXParametersIndex()                       # all parameters
d.getMSXParametersIndex('k1')                   # index of 'k1'
d.getMSXParametersIndex('k1', 'k3', 'kDOC1')    # specific set
d.getMSXParametersIndex(['k1', 'k3'])           # list/iterable
See also getMSXParametersCount, getMSXParametersIndex,
getMSXParametersTanksValue, getMSXParametersPipesValue.

getMSXParametersNameID(*ids)[source]
Return one or more MSX parameter names (IDs) by index.

Parameters
*idsint or iterable of int, optional
1-based indices of the parameters to retrieve. • No arguments -> all parameters are returned. • One iterable -> its contents are treated as the index list. • Several ints -> those specific indices are returned.

Returns
list[str]
Parameter names in the order requested.

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’)

Examples:
d.getMSXParametersNameID()          # all parameters
d.getMSXParametersNameID(1)         # first parameter
d.getMSXParametersNameID(1, 3)      # parameters 1 and 3
d.getMSXParametersNameID([2, 4, 5]) # parameters 2, 4, 5
See also getMSXParametersCount, getMSXParametersIndex,
getMSXParametersTanksValue, getMSXParametersPipesValue.

getMSXParametersPipesValue()[source]
Retrieves the parameters pipes value.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXParametersPipesValue()

See also setMSXParametersPipesValue, getMSXParametersTanksValue,
getMSXParametersCount, getMSXParametersIndex.

getMSXParametersTanksValue()[source]
Retrieves the parameters tanks value.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) tankIndex = d.getNodeTankIndex() d.getMSXParametersTanksValue{tankIndex} Retrieves the value of the first tank.

See also setMSXParametersTanksValue, getMSXParametersCount,
getMSXParametersIndex, getMSXParametersPipesValue.

getMSXPattern()[source]
Retrieves the time patterns.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.addMSXPattern(‘P1’, [1.0 0.0 1.0]) d.addMSXPattern(‘P2’, [1.0 0.0 1.0]) d.addMSXPattern(‘P3’, [0.0 1.0 2.0]) d.addMSXPattern(‘P4’, [1.0 2.0 2.5]) patterns = d.getMSXPattern() Retrieves all the patterns.

See also setMSXPattern, setMSXPatternMatrix, setMSXPatternValue,
getMSXPatternsIndex, getMSXPatternsNameID,.

getMSXPatternValue(patternIndex, patternStep)[source]
Retrieves the multiplier at a specific time period for a given source time pattern.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.addMSXPattern(‘P1’, [1.0 0.0 3.0]) d.getMSXPatternValue(1,3) Retrieves the third multiplier of the first pattern.

See also setMSXPatternValue, setMSXPattern, setMSXPatternMatrix,
getMSXPatternsIndex, getMSXPatternsNameID.

getMSXPatternsCount()[source]
Retrieves the number of patterns.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.addMSXPattern(‘P1’, [1.0, 0.0 1.0]) d.addMSXPattern(‘P2’, [0.0, 0.0 2.0]) d.getMSXPatternsCount()

See also setMSXPattern, setMSXPatternValue, addMSXPattern.

getMSXPatternsIndex(*names)[source]
Return the MSX index (1-based) of one or more patterns.

Parameters
*namesstr | iterable[str], optional
Pattern names (IDs) to look up. • No arguments – indices of all patterns are returned. • One iterable – its elements are treated as the name list. • Several strings – those exact pattern names.

Returns
list[int]
Pattern indices in the same order requested.

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’) d.addMSXPattern(‘P1’, [1.0, 0.0, 1.0]) d.addMSXPattern(‘P2’, [0.0, 0.0, 2.0]) d.addMSXPattern(‘P3’, [0.0, 1.0, 2.0]) d.addMSXPattern(‘P4’, [1.0, 1.0, 2.0])

Examples:
d.getMSXPatternsIndex()                     # all patterns
d.getMSXPatternsIndex('P1')                 # index of 'P1'
d.getMSXPatternsIndex('P1', 'P2', 'P3')     # specific set
d.getMSXPatternsIndex(['P1', 'P3'])         # iterable form
See also getMSXPattern, getMSXPatternsNameID, getMSXPatternsLengths,
setMSXPattern, setMSXPatternMatrix, setMSXPatternValue.

getMSXPatternsLengths(*indices)[source]
Return the length (number of factors) of one or more MSX patterns.

Parameters
*indicesint | iterable[int], optional
1-based pattern indices. • No arguments → return the length of all patterns. • One iterable → its items are treated as the index list. • Several ints → those exact pattern indices.

Returns
list[int]
Pattern lengths in the same order requested.

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’) d.addMSXPattern(‘P1’, [1.0, 0.0, 1.0]) d.addMSXPattern(‘P2’, [0.0, 0.0, 2.0]) d.addMSXPattern(‘P3’, [0.0, 1.0, 2.0]) d.addMSXPattern(‘P4’, [1.0, 1.0, 2.0])

Examples:
d.getMSXPatternsLengths()           # all patterns
d.getMSXPatternsLengths(1)          # pattern 1
d.getMSXPatternsLengths(1, 2)       # patterns 1 and 2
d.getMSXPatternsLengths([2, 4])     # iterable form
getMSXPatternsNameID(*ids)[source]
Return one or more MSX pattern names (IDs) by index.

Parameters
*idsint or iterable of int, optional
1-based indices of the patterns to retrieve. • Call with no arguments → all patterns are returned. • Pass a single iterable → its contents are treated as the index list. • Pass several ints → those specific indices are returned.

Returns
list[str]
Pattern names in the order requested.

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’) d.addMSXPattern(‘P1’, [1.0, 0.0, 1.0]) d.addMSXPattern(‘P2’, [0.0, 0.0, 2.0]) d.addMSXPattern(‘P3’, [0.0, 1.0, 2.0]) d.addMSXPattern(‘P4’, [1.0, 1.0, 2.0])

Examples
d.getMSXPatternsNameID()            # all patterns
d.getMSXPatternsNameID(1)           # first pattern
d.getMSXPatternsNameID(1, 3)        # patterns 1 and 3
d.getMSXPatternsNameID([2, 4, 5])   # patterns 2, 4, 5
See also getMSXPattern, getMSXPatternsIndex, getMSXPatternsLengths,
setMSXPattern, setMSXPatternMatrix, setMSXPatternValue.

getMSXRateUnits()[source]
Retrieves rate units. Example:

d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXRateUnits()

See also setMSXRateUnits.

getMSXRtol()[source]
Retrieves the relative accuracy level.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXRtol()

See also getMSXAtol.

getMSXSolver()[source]
Retrieves the solver method.

Numerical integration methods:
EUL = standard Euler integrator RK5 = Runge-Kutta 5th order integrator ROS2 = 2nd order Rosenbrock integrator.

Example:
d=epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXSolver()

See also setMSXSolverEUL, setMSXSolverRK5, setMSXSolverROS2.

getMSXSourceLevel(*nodes)[source]
Return the level value of one or more MSX sources.

For every (node, species) pair the EPANET-MSX toolkit call MSXgetsource(node, species) returns a 4-tuple (type, level, pattern, _reserved). This helper extracts only level (index 1).

Parameters
*nodesint | iterable[int], optional
1-based node indices. • No arguments – all nodes. • One iterable – its items are treated as the node list. • Several ints – those exact node indices.

Returns
list[list[float]]
Outer list follows the order requested; each inner list contains the level for every species at that node (length = getMSXSpeciesCount()).

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’)

Examples:
d.getMSXSourceLevel()               # levels for all nodes
d.getMSXSourceLevel(1)              # node 1
d.getMSXSourceLevel(1, 5)           # nodes 1 and 5
d.getMSXSourceLevel([2, 4, 7])      # iterable form
See also getMSXSources, getMSXSourceNodeNameID
getMSXSourceType, getMSXSourcePatternIndex.

getMSXSourceNodeNameID()[source]
Retrieves the sources node ID.

Example:
d = epanet(‘net2-cl2.inp’); d.loadMSXFile(‘net2-cl2.msx’); d.getMSXSourceNodeNameID Retrieves all the source node IDs.

See also getMSXSources, getMSXSourceType
getMSXSourceLevel, getMSXSourcePatternIndex.

getMSXSourcePatternIndex(*nodes)[source]
Return the pattern index associated with the source at one or more nodes.

For every (node, species) pair the EPANET-MSX call

MSXgetsource(node, species)

returns a 4-tuple (type, level, patternIndex, _reserved). This helper extracts only patternIndex (element 2).

Parameters
*nodesint | iterable[int], optional
1-based node indices. • No arguments → pattern indices for all nodes. • One iterable → its elements are the node list. • Several ints → those exact nodes.

Returns
list[list[int]]
Outer list follows the order requested; each inner list contains the pattern index for every species at that node (length = getMSXSpeciesCount()).

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’)

Examples:
d.getMSXSourcePatternIndex()              # every node
d.getMSXSourcePatternIndex(1)             # node 1
d.getMSXSourcePatternIndex(1, 5)          # nodes 1 and 5
d.getMSXSourcePatternIndex([2, 4, 7])     # iterable form
See also getMSXSources, getMSXSourceNodeNameID
getMSXSourceType, getMSXSourceLevel.

getMSXSourceType(*nodes)[source]
Return the source-type code(s) for one or more nodes.

Each MSX source is defined per (node, species). The toolkit call MSXgetsource(node, species) returns a 4-tuple (type, level, pattern, _reserved); we keep only the first element (the type code).

Parameters
*nodesint | iterable[int], optional
1-based node indices. • No arguments → all nodes. • One iterable → its items are treated as the node list. • Several ints → those exact nodes.

Returns
list[list[int]]
Outer list follows the order requested; inner list contains the source- type code for every species at that node (length = getMSXSpeciesCount()).

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’)

Examples:
d.getMSXSourceType()            # all nodes
d.getMSXSourceType(1)           # node 1
d.getMSXSourceType(1, 2)        # nodes 1 and 2
d.getMSXSourceType([3, 5, 7])   # iterable form
See also getMSXSources, getMSXSourceNodeNameID
getMSXSourceLevel, getMSXSourcePatternIndex.

getMSXSources()[source]
getMSXSpeciesATOL()[source]
Retrieves the species’ absolute tolerance.

Example:
d = epanet(‘net3-bio.inp’) d.loadMSXFile(‘net3-bio.msx’) d.getMSXSpeciesATOL()

See also getMSXSpeciesIndex, getMSXSpeciesCount, getMSXSpeciesConcentration,
getMSXSpeciesType, getMSXSpeciesNameID, getMSXSpeciesUnits, getMSXSpeciesRTOL.

getMSXSpeciesConcentration(type, index, species)[source]
Returns the node/link concentration for specific specie.

type options:
node = 0 link = 1

Example:
d = epanet(‘net2-cl2.inp’); d.loadMSXFile(‘net2-cl2.msx’); d.getMSXComputedQualitySpecie(‘CL2’) speciesIndex = d.getMSXSpeciesIndex(‘CL2’) d.getMSXSpeciesConcentration(0, 1, spIndex) Retrieves the CL2 concentration of the first node. d.getMSXSpeciesConcentration(1, 1, spIndex) Retrieves the CL2 concentration of the first link.

See also getMSXSpeciesIndex, getMSXSpeciesNameID,
getMSXSpeciesCount, getMSXSpeciesType, getMSXSpeciesUnits, getMSXSpeciesATOL, getMSXSpeciesRTOL.

getMSXSpeciesCount()[source]
Retrieves the number of species.

Example:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’) d.getMSXSpeciesCount()

See also getMSXSpeciesIndex, getMSXSpeciesNameID, getMSXSpeciesConcentration,
getMSXSpeciesType, getMSXSpeciesUnits, getMSXSpeciesATOL, getMSXSpeciesRTOL.

getMSXSpeciesIndex(*names)[source]
Return the MSX index (1-based) of one or more species.

Parameters
*namesstr | iterable[str], optional
Species IDs (names) to look up.

No arguments – return indices for all species.

One iterable – its elements are treated as the list of names.

Several strings – those specific species names.

Returns
list[int]
Indices in the same order the names were requested.

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’)

Examples:
d.getMSXSpeciesIndex()                     # all species
d.getMSXSpeciesIndex('NH3')                 # index of Na
d.getMSXSpeciesIndex('NH2CL', 'NH3', 'H')    # CL2, Nb, Na
d.getMSXSpeciesIndex(['NH3', 'TOC'])        # iterable form
See also getMSXSpeciesUnits, getMSXSpeciesCount, getMSXSpeciesConcentration,
getMSXSpeciesType, getMSXSpeciesNameID, getMSXSpeciesRTOL, getMSXSpeciesATOL.

getMSXSpeciesNameID(*argv)[source]
Retrieves the species’ ID.

Example:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’) d.getMSXSpeciesNameID() Retrieves the IDs of all the species. d.getMSXSpeciesNameID(1) Retrieves the IDs of the first specie.

See also getMSXSpeciesIndex, getMSXSpeciesCount, getMSXSpeciesConcentration,
getMSXSpeciesType, getMSXSpeciesUnits, getMSXSpeciesATOL, getMSXSpeciesRTOL.

getMSXSpeciesRTOL()[source]
Retrieves the species’ relative accuracy level.

Example:
d = epanet(‘net3-bio.inp’) d.loadMSXFile(‘net3-bio.msx’) d.getMSXSpeciesRTOL()

See also getMSXSpeciesIndex, getMSXSpeciesCount, getMSXSpeciesConcentration,
getMSXSpeciesType, getMSXSpeciesNameID, getMSXSpeciesUnits, getMSXSpeciesATOL.

getMSXSpeciesType(*indices)[source]
Return the MSX type (bulk-flow, wall, etc.) of one or more species.

Parameters
*indicesint | iterable[int], optional
1-based species indices. • No arguments → types for all species. • One iterable → its items are treated as the index list. • Several ints → those exact species indices.

Returns
list[int]
Species-type codes in the same order requested.

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’)

Examples:
d.getMSXSpeciesType()           # all species
d.getMSXSpeciesType(1)          # species 1
d.getMSXSpeciesType(5, 7)       # species 5 and 7
d.getMSXSpeciesType([2, 4, 6])  # iterable form
See also getMSXSpeciesIndex, getMSXSpeciesCount, getMSXSpeciesConcentration,
getMSXSpeciesnameID, getMSXSpeciesUnits, getMSXSpeciesATOL, getMSXSpeciesRTOL.

getMSXSpeciesUnits(*indices)[source]
Return the units string for one or more MSX species.

Parameters
*indicesint | iterable[int], optional
1-based species indices. • No arguments – return units for all species. • One iterable – its elements are treated as the index list. • Several ints – those exact species indices.

Returns
list[str]
Units strings in the same order requested.

Setup:
d = epanet(‘Net3-NH2CL.inp’) d.loadMSXFile(‘Net3-NH2CL.msx’)

Examples:
d.getMSXSpeciesUnits()             # all species
d.getMSXSpeciesUnits(1)            # species 1
d.getMSXSpeciesUnits(1, 16)        # species 1 and 16
d.getMSXSpeciesUnits([2, 4, 5])    # iterable form
See also getMSXSpeciesIndex, getMSXSpeciesCount, getMSXSpeciesConcentration,
              getMSXSpeciesType, getMSXSpeciesNameID, getMSXSpeciesATOL,
              getMSXSpeciesRTOL.
getMSXTimeStep()[source]
Retrieves the time step.

Example:
d=epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXTimeStep()

See also setMSXTimeStep.

getMethods()[source]
Returns all methods of epanet

Example:
filename = ‘L-TOWN.inp’ d=epanet(filename) methods = G.getmethods() print(methods)

getNetworksDatabase()[source]
Return all EPANET Input Files from EPyT database.

getNodeActualDemand(*argv)[source]
Retrieves the computed value of all node actual demands.

Example:

d.getNodeActualDemand()           # Retrieves the computed value of all node actual demands
d.getNodeActualDemand(1)          # Retrieves the computed value of the first node actual demand
d.getNodeActualDemand([1,2,3])    # Retrieves the computed value of the first 3 nodes actual demand
See also getNodeActualDemandSensingNodes, getNode HydraulicHead, getNodePressure, getNodeActualQuality, getNodeMassFlowRate, getNodeActualQualitySensingNodes.

getNodeActualDemandSensingNodes(*argv)[source]
Retrieves the computed demand values at some sensing nodes.

Example: Retrieves the computed demand value of the first sensing node.

d.getNodeActualDemandSensingNodes(1)
For more, you can type help (d.getNodePressure) and check examples 3 & 4.

See also getNodeActualDemand, getNodeHydraulicHead, getNodePressure, getNodeActualQuality, getNodeMassFlowRate, getNodeActualQualitySensingNodes.

getNodeActualQuality(*argv)[source]
Retrieves the computed values of the actual quality for all nodes.

Example:

d.getNodeActualQuality()        # Retrieves the computed values of the actual quality for all nodes
d.getNodeActualQuality(1)       # Retrieves the computed value of the actual quality for the first node
See also getNodeActualDemand, getNodeActualDemandSensingNodes, getNodePressure, getNodeHydraulicHead, getNodeMassFlowRate, getNodeActualQualitySensingNodes.

getNodeActualQualitySensingNodes(*argv)[source]
Retrieves the computed quality values at some sensing nodes

Example:

# Retrieves the computed quality value at the first node >>> d.getNodeActualQualitySensingNodes(1) # Retrieves the computed quality value at the first three nodes >>> d.getNodeActualQualitySensingNodes(1,2,3) For more, you can check examples 3 & 4 of getNodePressure.

See also getNodeActualDemand, getNodeActualDemandSensingNodes, getNodePressure, getNodeHydraulicHead, getNodeActualQuality, getNodeMassFlowRate.

getNodeBaseDemands(*argv)[source]
Retrieves the value of all node base demands.

Example 1:

d.getNodeBaseDemands()
d.getNodeBaseDemands()[1]      #  Get categories 1
Example 2:

d.getNodeBaseDemands(2)        # Get node base demand with categories for specific node index
See also setNodeBaseDemands, getNodeDemandCategoriesNumber, getNodeDemandPatternIndex, getNodeDemandPatternNameID.

getNodeComment(*argv)[source]
Retrieves the comment string assigned to the node object.

Example:

d.getNodeComment()              # Retrieves the comment string assigned to all node objects
d.getNodeComment(4)             # Retrieves the comment string assigned to the 4th node object
d.getNodeComment([1,2,3,4,5])   # Retrieves the comment string assigned to the 1st to 5th node object
See also setNodeComment, getNodesInfo, getNodeNameID, getNodeType.

getNodeCoordinates(*argv)[source]
getNodeCount()[source]
Retrieves the number of nodes.

Example:

d.getNodeCount()
See also getNodeIndex, getLinkCount().

getNodeDemandCategoriesNumber(*argv)[source]
Retrieves the value of all node base demands categorie number.

Example 1:

d.getNodeDemandCategoriesNumber()  # Retrieves the value of all node base demands categorie number
Example 2:

d.getNodeDemandCategoriesNumber(1)  # Retrieves the value of the first node base demand categorie number
Example 3:

d.getNodeDemandCategoriesNumber([1,2,3,4])  # Retrieves the value of the first 4 nodes base demand
categorie number
See also getNodeBaseDemands, getNodeDemandPatternIndex, getNodeDemandPatternNameID.

getNodeDemandDeficit(*argv)[source]
Retrieves the amount that full demand is reduced under PDA.

The example is based on d = epanet(‘Net1.inp’)

Example:

d.setDemandModel('PDA', 0, 0.1, 0.5)      # Sets a type of demand model and its parameters
d.getComputedHydraulicTimeSeries()        # Computes hydraulic simulation and retrieve all time-series
d.getNodeDemandDeficit()                  # Retrieves the amount that full demand is reduced under PDA
See also setDemandModel, getComputedHydraulicTimeSeries, getNodeActualDemand, getNodeActualDemandSensingNodes.

getNodeDemandPatternIndex()[source]
Retrieves the value of all node base demands pattern index.

Example:

d.getNodeDemandPatternIndex()
d.getNodeDemandPatternIndex()[1]
See also getNodeBaseDemands, getNodeDemandCategoriesNumber, getNodeDemandPatternNameID, setNodeDemandPatternIndex.

getNodeDemandPatternNameID()[source]
Retrieves the value of all node base demands pattern name ID.

Example:

d.getNodeDemandPatternNameID()
d.getNodeDemandPatternNameID()[1]
See also getNodeBaseDemands, getNodeDemandCategoriesNumber, getNodeDemandPatternIndex.

getNodeElevations(*argv)[source]
Retrieves the value of all node elevations. Example:

d.getNodeElevations()             # Retrieves the value of all node elevations
d.getNodeElevations(1)            # Retrieves the value of the first node elevation
d.getNodeElevations([4, 5, 6])    # Retrieves the value of the 5th to 7th node elevations
See also setNodeElevations, getNodesInfo, getNodeNameID, getNodeType, getNodeEmitterCoeff, getNodeInitialQuality.

getNodeEmitterCoeff(*argv)[source]
Retrieves the value of all node emmitter coefficients.

Example:

d.getNodeEmitterCoeff()         # Retrieves the value of all node emmitter coefficients
d.getNodeEmitterCoeff(1)        # Retrieves the value of the first node emmitter coefficient
See also setNodeEmitterCoeff, getNodesInfo, getNodeElevations.

getNodeHydraulicHead(*argv)[source]
Retrieves the computed values of all node hydraulic heads.

Example 1:

d.getNodeHydraulicHead()        # Retrieves the computed value of all node hydraulic heads
Example 2:

d.getNodeHydraulicHead(1)       # Retrieves the computed value of the first node hydraulic head
For more, you can type help getNodePressure and check examples 3 & 4.

See also getNodeActualDemand, getNodeActualDemandSensingNodes, getNodePressure, getNodeActualQuality, getNodeMassFlowRate, getNodeActualQualitySensingNodes.

getNodeIndex(*argv)[source]
Retrieves the indices of all nodes or some nodes with a specified ID.

Example 1:

d.getNodeIndex()              # Retrieves the indices of all nodes
Example 2:

nameID = d.getNodeNameID(1)
d.getNodeIndex(nameID)        # Retrieves the node index given the ID label of the 1st node
See also getNodeNameID, getNodeReservoirIndex, getNodeJunctionIndex, getNodeType, getNodeTypeIndex, getNodesInfo.

getNodeInitialQuality(*argv)[source]
Retrieves the value of all node initial quality.

Example 1:

d.getNodeInitialQuality()          # Retrieves the value of all node initial quality
Example 2:

d.getNodeInitialQuality(1)         # Retrieves the value of the first node initial quality
See also setNodeInitialQuality, getNodesInfo, getNodeSourceQuality.

getNodeJunctionCount()[source]
Retrieves the number of junction nodes.

Example:

d.getNodeJunctionCount()
See also getNodeTankCount, getNodeCount.

getNodeJunctionDemandIndex(*argv)[source]
Retrieves the demand index of the junctions.

Example 1:

d.getNodeJunctionDemandIndex()         # Retrieves the demand index of all junctions
Example 2:

d.getNodeJunctionDemandIndex(1,'')     # Retrieves the demand index of the 1st junction given it's name (i.e. '')
Example 3:

d.getNodeJunctionDemandIndex([1,2,3])  # Retrieves the demand index of the first 3 junctions
Example 4: Adds two new demands and retrieves the two new demand indices.

d.addNodeJunctionDemand([1, 2], [100, 110], ['1', '1'], ['new demand1', 'new demand2'])
d.getNodeJunctionDemandIndex([1,2],['new demand1','new demand2'])
See also getNodeJunctionDemandName, getNodeJunctionIndex, getNodeJunctionNameID, addNodeJunctionDemand, deleteNodeJunctionDemand, getNodeJunctionCount.

getNodeJunctionDemandName(*argv)[source]
Gets the name of a node’s demand category.

Example:

model = d.getNodeJunctionDemandName()
See also setNodeJunctionDemandName, getNodeBaseDemands, getNodeDemandCategoriesNumber, getNodeDemandPatternNameID.

getNodeJunctionIndex(*argv)[source]
Retrieves the indices of junctions.

Example:

d.getNodeJunctionIndex()          # Retrieves the indices of all junctions
d.getNodeJunctionIndex([1,2])     # Retrieves the indices of the first 2 junctions
See also getNodeNameID, getNodeIndex, getNodeReservoirIndex, getNodeType, getNodeTypeIndex, getNodesInfo.

getNodeJunctionNameID(*argv)[source]
Retrieves the junction ID label.

Example:

d.getNodeJunctionNameID()       # Retrieves the ID of all junctions
d.getNodeJunctionNameID(1)      # Retrieves the ID of the 1st junction
d.getNodeJunctionNameID([1,2])  # Retrieves the ID of the first 2 junction
See also getNodeNameID, getNodeReservoirNameID, getNodeIndex, getNodeJunctionIndex, getNodeType, getNodesInfo.

getNodeMassFlowRate(*argv)[source]
Retrieves the computed mass flow rates per minute of chemical sources for all nodes.

Example:

d.getNodeMassFlowRate()     # Retrieves the computed mass flow rates per minute of chemical sources for all nodes
d.getNodeMassFlowRate(1)    # Retrieves the computed mass flow rates per minute of chemical sources for the first node
For more, you can type help getNodePressure and check examples 3 & 4.

See also getNodeActualDemand, getNodeActualDemandSensingNodes, getNodePressure, getNodeHydraulicHead, getNodeActualQuality, getNodeActualQualitySensingNodes.

getNodeNameID(*argv)[source]
Retrieves the ID label of all nodes or some nodes with a specified index.

Example 1:

d.getNodeNameID()                   # Retrieves the ID label of all nodes
Example 2:

d.getNodeNameID(1)                  # Retrieves the ID label of the first node
Example 3:

junctionIndex = d.getNodeJunctionIndex()
d.getNodeNameID(junctionIndex)       # Retrieves the ID labels of all junctions give their indices
See also getNodeReservoirNameID, getNodeJunctionNameID, getNodeIndex, getNodeType, getNodesInfo.

getNodePatternIndex(*argv)[source]
Retrieves the value of all node demand pattern indices.

Example 1:

d.getNodePatternIndex()        #  Retrieves the value of all node demand pattern indices
Example 2:

d.getNodePatternIndex(1)       #  Retrieves the value of the first node demand pattern index
See also getNodeBaseDemands, getNodeDemandCategoriesNumber, getNodeDemandPatternIndex, getNodeDemandPatternNameID.

getNodePressure(*argv)[source]
Retrieves the computed values of all node pressures.

Example 1:

d.getNodePressure()          # Retrieves the computed values of all node pressures
Example 2:

d.getNodePressure(1)         # Retrieves the computed value of the first node pressure
Example 3: Hydraulic analysis step-by-step.

d.openHydraulicAnalysis()
d.initializeHydraulicAnalysis()
tstep,P , T_H, D, H, F, S, = 1, [], [], [], [] ,[], []
while (tstep>0):
    t = d.runHydraulicAnalysis()
    P.append(d.getNodePressure())
    D.append(d.getNodeActualDemand())
    H.append(d.getNodeHydraulicHead())
    S.append(d.getLinkStatus())
    F.append(d.getLinkFlows())
    T_H.append(t)
    tstep=d.nextHydraulicAnalysisStep()
d.closeHydraulicAnalysis()
Example 4: Hydraulic and Quality analysis step-by-step.

d.openHydraulicAnalysis()
d.openQualityAnalysis()
d.initializeHydraulicAnalysis(0)
d.initializeQualityAnalysis(d.ToolkitConstants.EN_NOSAVE)
tstep, P, T, F, QN, QL = 1, [], [], [], [], []
while (tstep>0):
    t  = d.runHydraulicAnalysis()
    qt = d.runQualityAnalysis()
    P.append(d.getNodePressure())
    F.append(d.getLinkFlows())
    QN.append(d.getNodeActualQuality())
    QL.append(d.getLinkActualQuality())
    T.append(t)
    tstep = d.nextHydraulicAnalysisStep()
    qtstep = d.nextQualityAnalysisStep()
d.closeQualityAnalysis()
d.closeHydraulicAnalysis()
See also getNodeActualDemand, getNodeActualDemandSensingNodes, getNodeHydraulicHead getNodeActualQuality, getNodeMassFlowRate, getNodeActualQualitySensingNodes.

getNodeReservoirCount()[source]
Retrieves the number of Reservoirs.

Example:

d.getNodeReservoirCount()
See also getNodeTankCount, getNodeCount.

getNodeReservoirHeadPatternIndex()[source]
Retrieves the value of all reservoir head pattern index.

Example:
d = epanet(‘net2-cl2.inp’) res_index = d.addNodeReservoir(“res-1”) pidx = d.addPattern(“pat-1”, [1, 3]) d.setNodeReservoirHeadPatternIndex(res_index, pidx) print(d.getNodeDemandPatternIndex()) print(d.getNodeReservoirHeadPatternIndex())

getNodeReservoirIndex(*argv)[source]
Retrieves the indices of reservoirs.

Example 1:

d.getNodeReservoirIndex()           # Retrieves the indices of all reservoirs.
Example 2:

d.getNodeReservoirIndex([1,2,3])    # Retrieves the indices of the first 3 reservoirs, if they exist.
See also getNodeNameID, getNodeIndex, getNodeJunctionIndex, getNodeType, getNodeTypeIndex, getNodesInfo.

getNodeReservoirNameID(*argv)[source]
Retrieves the reservoir ID label.

Example :

d.getNodeReservoirNameID()       # Retrieves the ID of all reservoirs
d.getNodeReservoirNameID(1)      # Retrieves the ID of the 1st reservoir
d.getNodeReservoirNameID([1,2])  # Retrieves the ID of the first 2 reservoirs (if they exist!)
See also getNodeNameID, getNodeJunctionNameID, getNodeIndex, getNodeReservoirIndex, getNodeType, getNodesInfo.

getNodeResultIndex(node_index)[source]
Retrieves the order in which a node’s results were saved to an output file.

Example:

node_index = 3
result_index = d.getNodeResultIndex(node_index)
See also getComputedHydraulicTimeSeries, deleteNode, getLinkResultIndex

getNodeSourcePatternIndex(*argv)[source]
Retrieves the value of all node source pattern index.

Example 1:

d.getNodeSourcePatternIndex() # Retrieves the value of all node source pattern index d.getNodeSourcePatternIndex(1) # Retrieves the value of the first node source pattern index

See also setNodeSourcePatternIndex, getNodeSourceQuality, getNodeSourceTypeIndex, getNodeSourceType.

getNodeSourceQuality(*argv)[source]
Retrieves the value of all node source quality.

Example 1:

d.getNodeSourceQuality()         # Retrieves the value of all node source quality
d.getNodeSourceQuality(1)        # Retrieves the value of the first node source quality
See also setNodeSourceQuality, getNodeInitialQuality, getNodeSourcePatternIndex, getNodeSourceTypeIndex, getNodeSourceType.

getNodeSourceType(*argv)[source]
Retrieves the value of all node source type.

Example:

d.getNodeSourceType()        # Retrieves the value of all node source type
d.getNodeSourceType(1)       # Retrieves the value of the first node source type
See also setNodeSourceType, getNodeSourceQuality, getNodeSourcePatternIndex, getNodeSourceTypeIndex.

getNodeSourceTypeIndex(*argv)[source]
Retrieves the value of all node source type index.

Example:

d.getNodeSourceTypeIndex()        # Retrieves the value of all node source type index
d.getNodeSourceTypeIndex(1)       # Retrieves the value of the first node source type index
See also getNodeSourceQuality, getNodeSourcePatternIndex, getNodeSourceType.

getNodeTankBulkReactionCoeff(*argv)[source]
Retrieves the tank bulk rate coefficient.

Example 1:

d.getNodeTankBulkReactionCoeff()                 # Retrieves the bulk rate coefficient of all tanks
Example 2:

d.getNodeTankBulkReactionCoeff(1)                # Retrieves the bulk rate coefficient of the 1st tank
Example 3:

d.getNodeTankBulkReactionCoeff([1,2])            # Retrieves the bulk rate coefficient of the first 2 tanks
Example 4:

tankIndex = d.getNodeTankIndex()
d.getNodeTankBulkReactionCoeff(tankIndex)        # Retrieves the bulk rate coefficient of the tanks given their indices
See also setNodeTankBulkReactionCoeff, getNodeTankData.

getNodeTankCanOverFlow(*argv)[source]
Retrieves the tank can overflow (= 1) or not (= 0).

Example 1:

d.getNodeTankCanOverFlow()             # Retrieves the can overflow of all tanks
Example 2:

d.getNodeTankCanOverFlow(1)            # Retrieves the can overflow of the 1st tank
Example 3:

d = epanet('BWSN_Network_1.inp')
d.getNodeTankCanOverFlow([1,2])        # Retrieves the can overflow of the first 2 tanks
Example 4:

d = epanet('BWSN_Network_1.inp')
tankIndex = d.getNodeTankIndex()
d.getNodeTankCanOverFlow(tankIndex)    # Retrieves the can overflow of the tanks given their indices
See also setNodeTankCanOverFlow, getNodeTankData.

getNodeTankCount()[source]
Retrieves the number of Tanks.

Example:

d.getNodeTankCount()
See also getNodeReservoirCount, getNodeCount.

getNodeTankData(*argv)[source]
Retrieves a group of properties for a tank.

Tank data that is retrieved:

Tank index

Elevation

Initial Level

Minimum Water Level

Maximum Water Level

Diameter

Minimum Water Volume

Volume Curve Index

Example 1:

tankData = d.getNodeTankData().to_dict()          # Retrieves all the data of all tanks
Example 2:

tankIndex = d.getNodeTankIndex()
tankData = d.getNodeTankData(tankIndex)        # Retrieves all the data given the index/indices of tanks.
Example 3:

d.getNodeTankData().Elevation                  # Retrieves the elevations of all tanks.
See also setNodeTankData, getNodeElevations, getNodeTankInitialLevel, getNodeTankMinimumWaterLevel, getNodeTankDiameter.

getNodeTankDiameter(*argv)[source]
Retrieves the tank diameters.

Example 1:

d.getNodeTankDiameter()                # Retrieves the diameters of all tanks
Example 2:

d.getNodeTankDiameter(1)               # Retrieves the diameter of the 1st tank
Example 3:

d.getNodeTankDiameter([1,2])           # Retrieves the diameters of the first 2 tanks
Example 4:

tankIndex = d.getNodeTankIndex()
d.getNodeTankDiameter(tankIndex)       # Retrieves the diameters of the tanks given their indices
See also setNodeTankDiameter, getNodeTankBulkReactionCoeff, getNodeTankInitialLevel, getNodeTankMixingModelType, getNodeTankVolume, getNodeTankNameID.

getNodeTankIndex(*argv)[source]
Retrieves the tank indices.

Example 1:

d.getNodeTankIndex() # Retrieves the tank indices. d.getNodeTankIndex(1) # Retrieves the first tank index.

See also getNodeTankCount, getNodeTankNameID.

getNodeTankInitialLevel(*argv)[source]
Retrieves the value of all tank initial water levels.

Example:

d = epanet("ky10.inp")
d.getNodeTankInitialLevel()         # Retrieves the value of all tank initial water levels
d.getNodeTankInitialLevel(11)       # Retrieves the value of the eleventh node(tank) water level
See also setNodeTankInitialLevel, getNodeTankInitialWaterVolume, getNodeTankVolume, getNodeTankMaximumWaterLevel, getNodeTankMinimumWaterLevel.

getNodeTankInitialWaterVolume(*argv)[source]
Retrieves the tank initial water volume.

Example 1:

d.getNodeTankInitialWaterVolume()                 #  Retrieves the initial water volume of all tanks
Example 2:

d.getNodeTankInitialWaterVolume(1)                #  Retrieves the initial water volume of the 1st tank
Example 3:

d.getNodeTankInitialWaterVolume([1,2])            #  Retrieves the initial water volume of the first 2 tanks
Example 4:

tankIndex = d.getNodeTankIndex()
d.getNodeTankInitialWaterVolume(tankIndex)        # Retrieves the initial water volume of the tanks given their indices
See also getNodeTankInitialLevel, getNodeTankVolume, getNodeTankMaximumWaterVolume, getNodeTankMinimumWaterVolume.

getNodeTankMaximumWaterLevel(*argv)[source]
Retrieves the tank maximum water level.

Example 1:

d.getNodeTankMaximumWaterLevel()                # Retrieves the maximum water level of all tanks
Example 2:

d.getNodeTankMaximumWaterLevel(1)               # Retrieves the maximum water level of the 1st tank
Example 3:

d.getNodeTankMaximumWaterLevel([1,2])           # Retrieves the maximum water level of the first 2 tanks
Example 4:

tankIndex = d.getNodeTankIndex()
d.getNodeTankMaximumWaterLevel(tankIndex)       # Retrieves the maximum water level of the tanks given their indices
See also setNodeTankMaximumWaterLevel, getNodeTankMinimumWaterLevel, getNodeTankInitialLevel, getNodeTankMaximumWaterVolume, getNodeTankMinimumWaterVolume, getNodeTankVolume.

getNodeTankMaximumWaterVolume(*argv)[source]
Retrieves the tank maximum water volume.

Example 1:

d.getNodeTankMaximumWaterVolume()              # Retrieves the maximum water volume of all tanks
Example 2:

d.getNodeTankMaximumWaterVolume(1)             # Retrieves the maximum water volume of the 1st tank
Example 3:

d.getNodeTankMaximumWaterVolume([1,2])         # Retrieves the maximum water volume of the first 2 tanks
Example 4:

tankIndex = d.getNodeTankIndex()
d.getNodeTankMaximumWaterVolume(tankIndex)     # Retrieves the maximum water volume of the tanks given their indices
See also getNodeTankMinimumWaterVolume, getNodeTankData.

getNodeTankMinimumWaterLevel(*argv)[source]
Retrieves the tank minimum water level.

Example 1:

d.getNodeTankMinimumWaterLevel()                # Retrieves the minimum water level of all tanks
Example 2:

d.getNodeTankMinimumWaterLevel(1)               # Retrieves the minimum water level of the 1st tank
Example 3:

d.getNodeTankMinimumWaterLevel([1,2])           # Retrieves the minimum water level of the first 2 tanks
Example 4:

tankIndex = d.getNodeTankIndex()
d.getNodeTankMinimumWaterLevel(tankIndex)       # Retrieves the minimum water level of the tanks given their indices
See also setNodeTankMinimumWaterLevel, getNodeTankMaximumWaterLevel, getNodeTankInitialLevel, getNodeTankMaximumWaterVolume, getNodeTankMinimumWaterVolume, getNodeTankVolume.

getNodeTankMinimumWaterVolume(*argv)[source]
Retrieves the tank minimum water volume.

Example 1:

d.getNodeTankMinimumWaterVolume()                # Retrieves the minimum water volume of all tanks
Example 2:

d.getNodeTankMinimumWaterVolume(1)               # Retrieves the minimum water volume of the 1st tank
Example 3:

d.getNodeTankMinimumWaterVolume([1,2])           # Retrieves the minimum water volume of the first 2 tanks
Example 4:

tankIndex = d.getNodeTankIndex()
d.getNodeTankMinimumWaterVolume(tankIndex)       # Retrieves the minimum water volume of the tanks given their indices
See also setNodeTankMinimumWaterVolume, getNodeTankMaximumWaterVolume, getNodeTankInitialWaterVolume, getNodeTankInitialLevel, getNodeTankVolume, getNodeTankMixZoneVolume.

getNodeTankMixZoneVolume(*argv)[source]
Retrieves the tank mixing zone volume.

Example 1:

d.getNodeTankMixZoneVolume()                # Retrieves the mixing zone volume of all tanks
Example 2:

d.getNodeTankMixZoneVolume(1)               # Retrieves the mixing zone volume of the 1st tank
Example 3:

d.getNodeTankMixZoneVolume([1,2])           # Retrieves the mixing zone volume of the first 2 tanks
Example 4:

tankIndex = d.getNodeTankIndex()
d.getNodeTankMixZoneVolume(tankIndex)       # Retrieves the mixing zone volume of the tanks given their indices
See also getNodeTankMixingModelCode, getNodeTankMixingModelType.

getNodeTankMixingFraction(*argv)[source]
Retrieves the tank Fraction of total volume occupied by the inlet/outlet zone in a 2-compartment tank.

Example 1:

d.getNodeTankMixingFraction()                # Retrieves the mixing fraction of all tanks
Example 2:

d.getNodeTankMixingFraction(1)                # Retrieves the mixing fraction of the 1st tank
Example 3:

d.getNodeTankMixingFraction([1,2])            # Retrieves the mixing fraction of the first 2 tanks
Example 4:

tankIndex = d.getNodeTankIndex()
d.getNodeTankMixingFraction(tankIndex)        # Retrieves the mixing fraction of the tanks given their indices
See also setNodeTankMixingFraction, getNodeTankData.

getNodeTankMixingModelCode(*argv)[source]
Retrieves the tank mixing model code.

Code meaning:
0 = Complete mix model (MIX1) 1 = 2-compartment model (MIX2) 2 = First in, first out model (FIFO) 3 = Last in, first out model (LIFO)

Example 1:

d.getNodeTankMixingModelCode()                # Retrieves the mixing model code of all tanks
Example 2:

d.getNodeTankMixingModelCode(1)               # Retrieves the mixing model code of the 1st tank
Example 3:

d.getNodeTankMixingModelCode([1,2])           # Retrieves the mixing model code of the first 2 tanks
Example 4:

tankIndex = d.getNodeTankIndex()
d.getNodeTankMixingModelCode(tankIndex)       # Retrieves the mixing model code of the tanks given their indices
See also setNodeTankMixingModelType, getNodeTankMixingModelType, getNodeTankMixZoneVolume.

getNodeTankMixingModelType(*argv)[source]
Retrieves the tank mixing model type.

Types of models that describe water quality mixing in storage tanks:
MIX1 = Complete mix model MIX2 = 2-compartment model FIFO = First in, first out model LIFO = Last in, first out model

Example 1:

d.getNodeTankMixingModelType()               # Retrieves the mixing model type of all tanks
Example 2:

d.getNodeTankMixingModelType(1)              # Retrieves the mixing model type of the 1st tank
Example 3:

d.getNodeTankMixingModelType([1,2])          # Retrieves the mixing model type of the first 2 tanks
Example 4:

tankIndex = d.getNodeTankIndex()
d.getNodeTankMixingModelType(tankIndex)      # Retrieves the mixing model type of the tanks given their indices
See also setNodeTankMixingModelType, getNodeTankMixingModelCode, getNodeTankMixZoneVolume

getNodeTankNameID(*argv)[source]
Retrieves the tank IDs.

Example:

d.getNodeTankNameID() # Retrieves the IDs of all tanks d.getNodeTankNameID(1) # Retrieves the ID of the 1st tank d.getNodeTankNameID([1,2]) # Retrieves the ID of the first 2 tanks (if they exist!)

See also getNodeTankCount, getNodeTankIndex.

getNodeTankReservoirCount()[source]
Retrieves the number of tanks/reservoirs.

Example:

d.getNodeTankReservoirCount()
See also getNodeTankIndex, getNodeReservoirIndex.

getNodeTankVolume(*argv)[source]
Retrieves the tank volume.

Example 1:

d.getNodeTankVolume()                  # Retrieves the volume of all tanks
Example 2:

d.getNodeTankVolume(1)                 # Retrieves the volume of the 1st tank
Example 3:

d.getNodeTankVolume([1,2])             # Retrieves the volume of the first 2 tanks
Example 4:

tankIndex = d.getNodeTankIndex()
d.getNodeTankVolume(tankIndex)         # Retrieves the volume of the tanks given their indices
See also getNodeTankData.

getNodeTankVolumeCurveIndex(*argv)[source]
Retrieves the tank volume curve index.

Example 1:

d.getNodeTankVolumeCurveIndex()                # Retrieves the volume curve index of all tanks
Example 2:

d.getNodeTankVolumeCurveIndex(1)               # Retrieves the volume curve index of the 1st tank
Example 3:

d.getNodeTankVolumeCurveIndex([1,2])           # Retrieves the volume curve index of the first 2 tanks
Example 4:

tankIndex = d.getNodeTankIndex()
d.getNodeTankVolumeCurveIndex(tankIndex)       # Retrieves the volume curve index of the tanks given their indices
See also getNodeTankVolume, getNodeTankMaximumWaterVolume, getNodeTankMinimumWaterVolume, getNodeTankInitialWaterVolume, getNodeTankMixZoneVolume.

getNodeType(*argv)[source]
Retrieves the node-type code for all nodes.

Example 1:

d.getNodeType()          # Retrieves the node-type code for all nodes
Example 2:

d.getNodeType(1)         # Retrieves the node-type code for the first node
Example 3:

d.getNodeType([10,11])   # Retrieves the node-type code for the tenth and eleventh nodes
See also getNodeNameID, getNodeIndex, getNodeTypeIndex, getNodesInfo.

getNodeTypeIndex(*argv)[source]
Retrieves the node-type code for all nodes.

Example:

d.getNodeTypeIndex()      # Retrieves the node-type code for all nodes
d.getNodeTypeIndex(1)     # Retrieves the node-type code for the first node
See also getNodeNameID, getNodeIndex, getNodeType, getNodesInfo.

getNodesConnectingLinksID(*argv)[source]
Retrieves the id of the from/to nodes of all links.

Example:

d.getNodesConnectingLinksID()            # Retrieves the id of the from/to nodes of all links
linkIndex = 1
d.getNodesConnectingLinksID(1)           # Retrieves the id of the from/to nodes of the 1st link
See also getLinkNodesIndex.

getNodesConnectingLinksIndex()[source]
Retrieves the indexes of the from/to nodes of all links. Duplicate function with getLinkNodesIndex for new version.

Example:

d.getNodesConnectingLinksIndex()
See also getLinkNodesIndex, getNodesConnectingLinksID.

getNodesInfo()[source]
Retrieves nodes info (elevations, demand patterns, emmitter coeff, initial quality, source quality, source pattern index, source type index, node type index).

Example:

d.getNodesInfo()
See also getNodeElevations, getNodeDemandPatternIndex, getNodeEmitterCoeff, getNodeInitialQuality, NodeTypeIndex.

getOptionsAccuracyValue()[source]
Retrieves the total normalized flow change for hydraulic convergence.

Example:

d.getOptionsAccuracyValue()
See also setOptionsAccuracyValue, getOptionsExtraTrials, getOptionsMaxTrials.

getOptionsCheckFrequency()[source]
Retrieves the frequency of hydraulic status checks.

Example:

d.getOptionsCheckFrequency()
See also setOptionsCheckFrequency, getOptionsMaxTrials, getOptionsMaximumCheck.

getOptionsDampLimit()[source]
Retrieves the accuracy level where solution damping begins.

Example:

d.getOptionsDampLimit()
See also setOptionsDampLimit, getOptionsMaxTrials, getOptionsCheckFrequency.

getOptionsDemandCharge()[source]
Retrieves the energy charge per maximum KW usage.

Example:

d.getOptionsDemandCharge()
See also setOptionsDemandCharge, getOptionsGlobalPrice, getOptionsGlobalPattern.

getOptionsEmitterExponent()[source]
Retrieves the power exponent for the emmitters.

Example:

d.getOptionsEmitterExponent()
See also setOptionsEmitterExponent, getOptionsPatternDemandMultiplier, getOptionsAccuracyValue.

getOptionsExtraTrials()[source]
Retrieves the extra trials allowed if hydraulics don’t converge.

Example:

d.getOptionsExtraTrials()
See also setOptionsExtraTrials, getOptionsMaxTrials, getOptionsMaximumCheck.

getOptionsFlowChange()[source]
Retrieves the maximum flow change for hydraulic convergence.

Example:

d.getOptionsFlowChange()
See also setOptionsFlowChange, getOptionsHeadError, getOptionsHeadLossFormula.

getOptionsGlobalEffic()[source]
Retrieves the global efficiency for pumps(percent).

Example:

d.getOptionsGlobalEffic()
See also setOptionsGlobalEffic, getOptionsGlobalPrice, getOptionsGlobalPattern.

getOptionsGlobalPattern()[source]
Retrieves the index of the global energy price pattern.

Example:

d.getOptionsGlobalPattern()
See also setOptionsGlobalPattern, getOptionsGlobalEffic, getOptionsGlobalPrice.

getOptionsGlobalPrice()[source]
Retrieves the global average energy price per kW-Hour.

Example:

d.getOptionsGlobalPrice()
See also setOptionsGlobalPrice, getOptionsGlobalEffic, getOptionsGlobalPattern.

getOptionsHeadError()[source]
Retrieves the maximum head loss error for hydraulic convergence.

Example:

d.getOptionsHeadError()
See also setOptionsHeadError, getOptionsEmitterExponent, getOptionsAccuracyValue.

getOptionsHeadLossFormula()[source]
Retrieves the headloss formula.

Example:

d.getOptionsHeadLossFormula()
See also setOptionsHeadLossFormula, getOptionsHeadError, getOptionsFlowChange.

getOptionsLimitingConcentration()[source]
Retrieves the limiting concentration for growth reactions.

Example:

d.getOptionsLimitingConcentration()
See also setOptionsLimitingConcentration, getOptionsPipeBulkReactionOrder, getOptionsPipeWallReactionOrder.

getOptionsMaxTrials()[source]
Retrieves the maximum hydraulic trials allowed for hydraulic convergence.

Example:

d.getOptionsMaxTrials()
See also setOptionsMaxTrials, getOptionsExtraTrials, getOptionsAccuracyValue.

getOptionsMaximumCheck()[source]
Retrieves the maximum trials for status checking.

Example:

d.getOptionsMaximumCheck()
See also setOptionsMaximumCheck, getOptionsMaxTrials, getOptionsCheckFrequency.

getOptionsPatternDemandMultiplier()[source]
Retrieves the global pattern demand multiplier.

Example:

d.getOptionsPatternDemandMultiplier()
See also setOptionsPatternDemandMultiplier, getOptionsEmitterExponent, getOptionsAccuracyValue.

getOptionsPipeBulkReactionOrder()[source]
Retrieves the bulk water reaction order for pipes.

Example:

d.getOptionsPipeBulkReactionOrder()
See also setOptionsPipeBulkReactionOrder, getOptionsPipeWallReactionOrder, getOptionsTankBulkReactionOrder.

getOptionsPipeWallReactionOrder()[source]
Retrieves the wall reaction order for pipes (either 0 or 1).

Example:

d.getOptionsPipeWallReactionOrder()
See also setOptionsPipeWallReactionOrder, getOptionsPipeBulkReactionOrder, getOptionsTankBulkReactionOrder.

getOptionsQualityTolerance()[source]
Retrieves the water quality analysis tolerance.

Example:

d.getOptionsQualityTolerance()
See also setOptionsQualityTolerance, getOptionsSpecificDiffusivity, getOptionsLimitingConcentration.

getOptionsSpecificDiffusivity()[source]
Retrieves the specific diffusivity (relative to chlorine at 20 deg C).

Example:

d.getOptionsSpecificDiffusivity()
See also setOptionsSpecificDiffusivity, getOptionsSpecificViscosity, getOptionsSpecificGravity.

getOptionsSpecificGravity()[source]
Retrieves the specific gravity.

Example:

d.getOptionsSpecificGravity()
See also setOptionsSpecificGravity, getOptionsSpecificViscosity, getOptionsHeadLossFormula.

getOptionsSpecificViscosity()[source]
Retrieves the specific viscosity.

Example:

d.getOptionsSpecificViscosity()
See also setOptionsSpecificViscosity, getOptionsSpecificGravity, getOptionsHeadLossFormula.

getOptionsTankBulkReactionOrder()[source]
Retrieves the bulk water reaction order for tanks.

Example:

d.getOptionsTankBulkReactionOrder()
See also setOptionsTankBulkReactionOrder, getOptionsPipeBulkReactionOrder, getOptionsPipeWallReactionOrder.

getPattern()[source]
Retrieves the multiplier factor for all patterns and all times.

Example:

d.getPattern()
See also getPatternLengths, getPatternValue, getPatternAverageValue().

getPatternAverageValue()[source]
Retrieves the average values of all the time patterns.

Example:

d.getPatternAverageValue()
See also getPattern, setPattern, getPatternValue, getPatternLengths.

getPatternComment(*argv)[source]
Retrieves the comment string assigned to the pattern object.

Example:

d.getPatternComment()       # Retrieves the comments of all the patterns
d.getPatternComment(1)      # Retrieves the comment of the 1st pattern
d.getPatternComment([1,2])  # Retrieves the comments of the first 2 patterns
See also setPatternComment, getPattern.

getPatternCount()[source]
Retrieves the number of patterns.

Example:

d.getPatternCount()
See also getPatternIndex, getPattern.

getPatternIndex(*argv)[source]
Retrieves the index of all or some time patterns given their IDs.

Example 1:

d.getPatternIndex()              # Retrieves the indices of all time patterns
Example 2:

patternIndex = 1
patternID = d.getPatternNameID(patternIndex)
d.getPatternIndex(patternID)     # Retrieves the index of the 1st time pattern given it's ID
Example 3:

d = epanet('Richmond_standard.inp')
patternIndex = [1,2]
patternID = d.getPatternNameID(patternIndex)
d.getPatternIndex(patternID)     # Retrieves the index of the first 2 time patterns given their IDs
See also getPatternNameID, getPattern.

getPatternLengths(*argv)[source]
Retrieves the number of time periods in all or some time patterns.

Example 1:

d.getPatternLengths()                 # Retrieves the number of time periods of all time patterns
Example 2:

patternIndex = 1
d.getPatternLengths(patternIndex)     # Retrieves the number of time periods of the 1st time pattern
Example 3:

d = epanet('BWSN_Network_1.inp')
patternIndex = [1,2,3]
d.getPatternLengths(patternIndex)     # Retrieves the number of time periods of the first 2 time patterns
See also getPatternIndex, getPattern.

getPatternNameID(*argv)[source]
Retrieves the ID label of all or some time patterns indices.

Example 1:

d.getPatternNameID()          # Retrieves the IDs of all the patterns
Example 2:

d.getPatternNameID(1)         # Retrieves the ID of the 1st pattern
Example 3:

d.getPatternNameID([1,2])     # Retrieves the IDs of the first 2 patterns
See also setPatternNameID, getPattern.

getPatternValue(patternIndex, patternStep)[source]
Retrieves the multiplier factor for a certain pattern and time.

Example:

patternIndex = 1
patternStep = 5
d.getPatternValue(patternIndex, patternStep)   # Retrieves the 5th multiplier factor of the 1st time pattern
See also getPattern, getPatternLengths, getPatternAverageValue().

getQualityCode()[source]
Retrieves the code of water quality analysis type.

Water quality analysis code:
0 = No quality analysis 1 = Chemical analysis 2 = Water age analysis 3 = Source tracing

Example:

d.getQualityCode()
See also getQualityInfo, getQualityType.

getQualityInfo()[source]
Retrieves quality analysis information (type, chemical name, units, trace node ID).

Information that is retrieved:
Water quality analysis code 0 = No quality analysis 1 = Chemical analysis 2 = Water age analysis 3 = Source tracing

Name of the chemical being analyzed

Units that the chemical is measured in

Index of node traced in a source tracing analysis

Quality type

Example:

qualInfo = d.getQualityInfo()          # Retrieves all the quality info
qualInfo.to_dict()
d.getQualityInfo().QualityCode         # Retrieves the water quality analysis code
d.getQualityInfo().QualityChemName     # Retrieves the name of the chemical being analyzed
d.getQualityInfo().QualityChemUnits    # Retrieves the units that the chemical is measured in
d.getQualityInfo().TraceNode           # Retrieves the index of node traced in a source tracing analysis
d.getQualityInfo().QualityType         # Retrieves the quality type
See also getQualityType, getQualityCode.

getQualityTraceNodeIndex()[source]
Retrieves the trace node index of water quality analysis type.

Example:

d.getQualityTraceNodeIndex()
See also getQualityInfo, getQualityType.

getQualityType(*argv)[source]
Retrieves the type of water quality analysis type.

Example:

d.getQualityType()
See also getQualityInfo, getQualityCode.

getRuleCount()[source]
Retrieves the number of rules.

Example:

d.getRuleCount()
See also getRules, getControlRulesCount.

getRuleID(*argv)[source]
Retrieves the ID name of a rule-based control given its index.

# The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example:

d.getRuleID()           # Retrieves the ID name of every rule-based control
d.getRuleID(1)          # Retrieves the ID name of the 1st rule-based control
d.getRuleID([1,2,3])    # Retrieves the ID names of the 1st to 3rd rule-based control
See also getRules, getRuleInfo, addRules.

getRuleInfo(*argv)[source]
Retrieves summary information about a rule-based control given it’s index.

The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example:

RuleInfo = d.getRuleInfo()          # Retrieves summary information about every rule-based control
d.getRuleInfo(1).to_dict()           # Retrieves summary information about the 1st rule-based control
d.getRuleInfo([1,2,3]).to_dict()     # Retrieves summary information about the 1st to 3rd rule-based control
See also getRuleID, getRules, addRules.

getRules(*argv)[source]
Retrieves the rule - based control statements.

# The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example 1:

rules = d.getRules()
rule_first_index = 1
rule_first = rules[rule_first_index]                   # Retrieves all the statements of the 1st rule - based control
rule_second_index = 2
rule_second = rules[rule_second_index]                 # Retrieves all the statements of the 2nd rule - based control
Example 2:

rule_first = d.getRules(1)                                  # Retrieves all the statements of the 1st rule - based control
rule_first_ID = d.getRules()[1]['Rule_ID']                  # Retrieves the ID of the 1st rule - based control
rule_first_premises = d.getRules()[1]['Premises']           # Retrieves all the premises of the 1st rule - based control
rule_first_Then_Actions = d.getRules()[1]['Then_Actions']   # Retrieves all the then actions of the 1st rule - based control
rule_first_Else_Actions = d.getRules()[1]['Else_Actions']   # Retrieves all the else actions of the 1st rule - based control
rule_first_Rule = d.getRules()[1]['Rule']
See also getRuleInfo, getRuleID, getRuleCount, setRules, deleteRules, addRules.

getStatistic()[source]
Returns error code.

Input: none

Output:
iter: # of iterations to reach solution

relerr: convergence error in solution

Example:

d.getStatistic().disp()
getTimeHTime()[source]
Retrieves the elapsed time of current hydraulic solution.

Example:

d.getTimeHTime()
See also getTimeSimulationDuration, getComputedHydraulicTimeSeries.

getTimeHaltFlag()[source]
Retrieves the number of halt flag indicating if the simulation was halted.

Example:

d.getTimeHaltFlag()
See also getTimeStartTime, getTimeSimulationDuration.

getTimeHydraulicStep()[source]
Retrieves the value of the hydraulic time step.

Example:

d.getTimeHydraulicStep()
See also getTimeQualityStep, getTimeSimulationDuration.

getTimeNextEvent()[source]
Retrieves the shortest time until a tank becomes empty or full.

Example:

d.getTimeNextEvent()
See also getTimeNextEventTank.

getTimeNextEventTank()[source]
Retrieves the index of tank with shortest time to become empty or full.

Example:

d.getTimeNextEventTank()
See also getTimeNextEvent.

getTimePatternStart()[source]
Retrieves the value of pattern start time.

Example:

d.getTimePatternStart()
See also getTimePatternStep, getTimeSimulationDuration.

getTimePatternStep()[source]
Retrieves the value of the pattern time step.

Example:

d.getTimePatternStep()
See also getTimePatternStart, getTimeSimulationDuration.

getTimeQTime()[source]
Retrieves the elapsed time of current quality solution.

Example:

d.getTimeQTime()
See also getTimeQualityStep, getComputedQualityTimeSeries.

getTimeQualityStep()[source]
Retrieves the value of the water quality time step.

Example:

d.getTimeQualityStep()
See also getTimeSimulationDuration, getTimeSimulationDuration.

getTimeReportingPeriods()[source]
Retrieves the number of reporting periods saved to the binary.

Example:

d.getTimeReportingPeriods()
See also getTimeReportingStart, getTimeReportingStep.

getTimeReportingStart()[source]
Retrieves the value of the reporting start time.

Example:

d.getTimeReportingStart()
See also getTimeReportingPeriods, getTimeReportingStep.

getTimeReportingStep()[source]
Retrieves the value of the reporting time step.

Example:

d.getTimeReportingStep()
See also getTimeReportingPeriods, getTimeReportingStart.

getTimeRuleControlStep()[source]
Retrieves the time step for evaluating rule-based controls.

Example:

d.getTimeRuleControlStep()
See also getTimeSimulationDuration.

getTimeSimulationDuration()[source]
Retrieves the value of simulation duration.

Example:

d.getTimeSimulationDuration()
See also getTimePatternStep, getTimeSimulationDuration.

getTimeStartTime()[source]
Retrieves the simulation starting time of day.

Example:

d.getTimeStartTime()
See also getTimeSimulationDuration, getTimePatternStart.

getTimeStatisticsIndex()[source]
Retrieves the index of the type of time series post-processing.

Type of time series post-processing:
0 = ‘NONE’ 1 = ‘AVERAGE’ 2 = ‘MINIMUM’ 3 = ‘MAXIMUM’ 4 = ‘RANGE’

Example:

d.getTimeStatisticsIndex()
See also getTimeStatisticsType, getTimeSimulationDuration.

getTimeStatisticsType()[source]
Retrieves the type of time series post-processing.

Types:
NONE: Reports the full time series for all quantities for all nodes and links (default)

AVERAGE: Reports a set of time-averaged results

MINIMUM: Reports only the minimum values

MAXIMUM: Reports only the maximum values

RANGE: Reports the difference between the minimum and maximum values

Example:

d.getTimeStatisticsType()
See also getTimeStatisticsIndex, getTimeSimulationDuration.

getTitle(*argv)[source]
Retrieves the title lines of the project.

Example: Retrieves the three title lines of the project.

[Line1, Line2, Line3] = d.getTitle()
See also setTitle.

getUnits()[source]
Retrieves the Units of Measurement.

Example 1:

allUnits = d.getUnits()           # Retrieves all the unitperiod
allUnits.to_dict()                # Print all values
Example 2:

d.getUnits().NodeElevationUnits   # Retrieves elevation units
d.getUnits().LinkVelocityUnits    # Retrieves velocity units
OWA-EPANET Toolkit: https://github.com/OpenWaterAnalytics/EPANET/wiki/Units-of-Measurement

See also getFlowUnits.

getVersion()[source]
Retrieves the current EPANET version of DLL.

Example:

d.getVersion()
See also getENfunctionsImpemented, getLibFunctions.

initializeEPANET(unitsType, headLossType)[source]
Initializes an EPANET project that isn’t opened with an input file

Example:

d.initializeEPANET(d.ToolkitConstants.EN_GPM, d.ToolkitConstants.EN_HW)
See also initializeHydraulicAnalysis.

initializeHydraulicAnalysis(*argv)[source]
Initializes storage tank levels, link status and settings, and the simulation clock time prior to running a hydraulic analysis.

Codes:
NOSAVE = 0, Don’t save hydraulics don’t re-initialize flows

SAVE = 1, Save hydraulics to file, don’t re-initialize flows

INITFLOW = 10, Don’t save hydraulics re-initialize flows

SAVE_AND_INIT = 11 Save hydraulics re-initialize flows

Example 1:

d.initializeHydraulicAnalysis()     # Uses the default code i.e. SAVE = 1
Example 2:

code = 0                            # i.e. Don't save
d.initializeHydraulicAnalysis(code)
For more, you can type help d.getNodePressure and check examples 3 & 4.

See also saveHydraulicFile, initializeQualityAnalysis.

initializeMSXQualityAnalysis(flag)[source]
Initializes the MSX system before solving for water quality results in step-wise fashion.

flag options:
1: if water quality results should be saved to a scratch
binary file or

0: if results are not saved to file.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) tleft = 1 d.solveMSXCompleteHydraulics() d.initializeMSXQualityAnalysis(0) while(tleft>0):

t,tleft = d.stepMSXQualityAnalysisTimeLeft

See also solveMSXCompleteHydraulics, stepMSXQualityAnalysisTimeLeft.

initializeMSXWrite()[source]
initializeQualityAnalysis(*argv)[source]
Initializes water quality and the simulation clock time prior to running a water quality analysis.

Codes:
NOSAVE = 0, Don’t save the results to the project’s binary output file.

SAVE = 1, Save the results to the project’s binary output file.

Example 1:

d.initializeQualityAnalysis()       #  Uses the default code i.e. SAVE = 1
Example 2:

code = 0                            # i.e. Don't save
d.initializeQualityAnalysis(code)
For more, you can type help getNodePressure and check examples 3 & 4.

See also openQualityAnalysis, initializeHydraulicAnalysis.

loadEPANETFile(*argv)[source]
Load epanet file when use bin functions.

Example:

d.loadEPANETFile(d.TempInpFile)
loadMSXEPANETFile(msxfile)[source]
Load EPANET MSX file.

Example:

d.loadMSXEPANETFile(d.MSXTempFile)
loadMSXFile(msxname, customMSXlib=None, ignore_properties=False)[source]
Loads an msx file Example:

d.loadMSXFile(‘net2-cl2.msx’)

Example using custom msx library : msxlib=os.path.join(os.getcwd(), ‘epyt’,’libraries’,’win’,’epanetmsx.dll’)

d = epanet(inpname, msx=True, customlib=epanetlib) d.loadMSXFile(msxname, customMSXlib=msxlib)

loadlibrary()[source]
max(value)[source]
Retrieves the smax value of numpy.array or numpy.mat

min(value)[source]
Retrieves the min value of numpy.array or numpy.mat

multiply_elements(arr1, arr2)[source]
Multiply elementwise two numpy.array or numpy.mat variables

nextHydraulicAnalysisStep()[source]
Determines the length of time until the next hydraulic event occurs in an extended period simulation.

Example:

d.nextHydraulicAnalysisStep()
For more, you can type help (d.getNodePressure) and check examples 3 & 4.

See also nextQualityAnalysisStep, runHydraulicAnalysis.

nextQualityAnalysisStep()[source]
Advances the water quality simulation to the start of the next hydraulic time period.

Example:

d.nextQualityAnalysisStep()
For more, you can type help getNodePressure and check examples 3 & 4.

See also nextHydraulicAnalysisStep, runQualityAnalysis.

openAnyInp(*argv)[source]
Open as on matlab editor any EPANET input file using built in function open. Open current loaded input file (not temporary)

Example:

d.openAnyInp()
d.openAnyInp('epyt/networks/Net2.inp')
openCurrentInp(*argv)[source]
Opens EPANET input file who is loaded

Example:

d.openCurrentInp()
openHydraulicAnalysis()[source]
Opens the hydraulics analysis system.

Example:

d.openHydraulicAnalysis()
For more, you can type help d.getNodePressure and check examples 3 & 4.

See also openQualityAnalysis, initializeHydraulicAnalysis.

openQualityAnalysis()[source]
Opens the water quality analysis system.

Example:

d.openQualityAnalysis()
For more, you can type help getNodePressure and check examples 3 & 4.

See also openHydraulicAnalysis, initializeQualityAnalysis.

plot(title=None, line=None, point=None, nodesID=None, nodesindex=None, linksID=None, linksindex=None, highlightlink=None, highlightnode=None, legend=True, fontsize=5, figure=True, fig_size=[3, 2], dpi=300, node_values=None, node_text=False, link_values=None, link_text=False, colorbar='turbo', min_colorbar=None, max_colorbar=None, colors=None, colorbar_label=None, highligthlink_linewidth=1, highligthnode_linewidth=3.5, *argv)[source]
Plot Network, show all components, plot pressure/flow/elevation/waterage/anyvalue

Example 1:

d = epanet('Net1.inp')
d.plot()                                   # Plot Net1.inp network
Example 2:

d = epanet('Net1.inp')                     # Run hydralic analysis and plot the pressures at 10hrs
d.openHydraulicAnalysis()
d.initializeHydraulicAnalysis()
tstep, P = 1, []
while tstep>0:
   t = d.runHydraulicAnalysis()
   P.append(d.getNodePressure())
   tstep=d.nextHydraulicAnalysisStep()
d.closeHydraulicAnalysis()
hr = 10
d.plot(node_values = P[hr])
plotMSXSpeciesLinkConcentration(*args)[source]
% Plots concentration of species for links over time.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.plotMSXSpeciesLinkConcentration(5, 2) Plots node index 5 concentration of the second specie over time. d.plotMSXSpeciesLinkConcentration(1, 1) Plots first node’s concentration of the first specie over time.

Example 2: d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) x = [1,2,3,4,5] d.plotMSXSpeciesLinkConcentration(x,1) # Plots concentration of links 1 to 5 for the first specie over time.

% See also plotMSXSpeciesNodeConcentration.

plotMSXSpeciesNodeConcentration(*args)[source]
Plots concentration of species for nodes over time.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.plotMSXSpeciesNodeConcentration([1],[1]) # Plots first node’s concentration of the first specie over time.

Example 2:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) x = [1,2,3,4,5] d.plotMSXSpeciesNodeConcentration(x,1) # Plots concentration of nodes 1 to 5 for the first specie over time.

See also plotMSXSpeciesLinkConcentration.

plot_close()[source]
Close all open figures

plot_save(name, dpi=300)[source]
Save plot

plot_show()[source]
Show plot

plot_ts(X=None, Y=None, title='', xlabel='', ylabel='', color=None, marker='x', figure_size=[3, 2.5], constrained_layout=True, fontweight='normal', fontsize_title=8, fontsize=8, labels=None, save_fig=False, filename='temp', tight_layout=False, dpi=300, filetype='png', legend_location='best')[source]
Plot X Y data

printv(var)[source]
reloadNetwork()[source]
Reloads the Network (ENopen)

runEPANETexe()[source]
Runs epanet .exe file

runHydraulicAnalysis()[source]
Runs a single period hydraulic analysis, retrieving the current simulation clock time t.

Example:

tstep = d.runHydraulicAnalysis()
For more, you can type help getNodePressure and check examples 3 & 4.

See also runQualityAnalysis, initializeHydraulicAnalysis.

runQualityAnalysis()[source]
Makes available the hydraulic and water quality results that occur at the start of the next time period of a water quality analysis, where the start of the period is returned in t.

Example:

tstep = d.runQualityAnalysis()
For more, you can type help getNodePressure and check examples 3 & 4.

See also runHydraulicAnalysis, initializeQualityAnalysis.

runsCompleteSimulation(*argv)[source]
Runs a complete hydraulic and water simulation to create binary & report files with name: [NETWORK_temp.txt], [NETWORK_temp.bin] OR you can use argument to runs a complete simulation via self.api.en_epanet

Example:

d.runsCompleteSimulation()
d.runsCompleteSimulation('results')  # using d.api.en_epanet
saveHydraulicFile(hydname)[source]
Saves the current contents of the binary hydraulics file to a file.

Example:

filename = 'test.hyd'
d.saveHydraulicFile(filename)
For more, you can type help getNodePressure and check examples 3 & 4.

See also useHydraulicFile, initializeHydraulicAnalysis.

saveHydraulicsOutputReportingFile()[source]
Transfers results of a hydraulic simulation from the binary Hydraulics file to the binary Output file, where results are only reported at uniform reporting intervals.

Example:

d.saveHydraulicsOutputReportingFile()
See also saveHydraulicFile, closeHydraulicAnalysis.

saveInputFile(*argv)[source]
Writes all current network input data to a file using the format of an EPANET input file. Returns an error code.

Example:

filename = ('test.inp')
d.saveInputFile(filename)
See also unload, saveHydraulicFile.

saveMSXFile(msxname)[source]
Saves the data associated with the current MSX project into a new MSX input file.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.saveMSXFile(‘testMSX.msx’)

See also writeMSXFile.

saveMSXQualityFile(outfname)[source]
Saves the quality as bin file.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXComputedQualitySpecie(‘CL2’) d.saveMSXQualityFile(‘testMSXQuality.bin’)

setCMDCODE(code)[source]
Sets the CMC code

setControls(index, control=None, *argv)[source]
Sets the parameters of a simple control statement.

The examples are based on d = epanet(‘Net1.inp’)

Example 1:

controlIndex = 1
d.getControls(controlIndex).disp()       # Retrieves the 1st control
control = 'LINK 9 CLOSED IF NODE 2 ABOVE 180'
d.setControls(controlIndex, control)     # Sets a control given it's index and the control statement
d.getControls(controlIndex).disp()
Example 2:

controls = d.getControls()
d.setControls(controls)              # Sets multiple controls given as dicts with keys
Example 3:

control_1 = 'LINK 9 OPEN IF NODE 2 BELOW 110'
control_2 = 'LINK 9 CLOSED IF NODE 2 ABOVE 200'
controls = [control_1, control_2]
d.setControls(controls)              # Sets multiple controls given as cell
d.getControls(1).disp()
d.getControls(2).disp()
Example 4:
index: control statement index

control: control type code

lindex: index of link being controlled

setting: value of the control setting

nindex: index of controlling node

level: value of controlling water level or pressure for
level controls or of time of control action (in seconds) for time-based controls

Control type codes consist of the following:
EN_LOWLEVEL 0 Control applied when tank level or node pressure drops below specified level

EN_HILEVEL 1 Control applied when tank level or node pressure rises above specified level

EN_TIMER 2 Control applied at specific time into simulation

EN_TIMEOFDAY 3 Control applied at specific time of day

Code example: d.setControls(index, control, lindex, setting, nindex, level)

d.setControls(1, 0, 13, 0, 11, 30)
See also getControls, getControlRulesCount, addControls, deleteControls.

setCurve(index, curveVector)[source]
Sets x, y values for a specific curve.

The example is based on d = epanet(‘BWSN_Network_1.inp’)

Example:

curveIndex = 1
d.getCurvesInfo().CurveXvalue[curveIndex-1]    # Retrieves the X values of the 1st curve
d.getCurvesInfo().CurveYvalue[curveIndex-1]    # Retrieves the Y values of the 1st curve
x_y_1 = [0, 730]
x_y_2 = [1000, 500]
x_y_3 = [1350, 260]
values = [x_y_1, x_y_2, x_y_3]             # X and Y values selected.
d.setCurve(curveIndex, values)             # Sets the X and Y values of the 1st curve
d.getCurvesInfo().CurveXvalue[curveIndex-1]
d.getCurvesInfo().CurveYvalue[curveIndex-1]
See also setCurveValue, getCurvesInfo.

setCurveComment(value, *argv)[source]
Sets the comment string of a curve.

Example 1:

d.getCurveComment()                      # Retrieves the comments of all the curves
curveIndex = 1
comment = 'This is a curve'
d.setCurveComment(curveIndex, comment)   # Sets a comment to the 1st curve
d.getCurveComment(curveIndex)
Example 2:

d = epanet('BWSN_Network_1.inp')
d.getCurveComment()
curveIndex = [1,2]
comment = ['This is the 1st curve', 'This is the 2nd curve']
d.setCurveComment(curveIndex, comment)   # Sets comments to the first 2 curves
d.getCurveComment(curveIndex)
See also getCurveComment, getCurveIndex, getCurvesInfo.

setCurveNameID(index, Id)[source]
Sets the name ID of a curve given it’s index and the new ID.

Example 1:

d.getCurveNameID()                               # Retrieves the name IDs of all the curves
d.setCurveNameID(1, 'Curve1')                    # Sets to the 1st curve the new name ID 'Curve1'
d.getCurveNameID()
Example 2: Sets to the 1st and 2nd curve the new name IDs ‘Curve1’ and ‘Curve2’ respectively.

d.setCurveNameID([1, 2], ['Curve1', 'Curve2'])
d.getCurveNameID()
See also getCurveNameID, getCurveIndex, getCurveLengths, setCurve, setCurveComment, getCurveComment.

setCurveValue(index, curvePnt, value)[source]
Sets x, y point for a specific point number and curve.

The example is based on d = epanet(‘BWSN_Network_1.inp’)

Example:

curveIndex = 1
d.getCurvesInfo().CurveXvalue[curveIndex-1]            # Retrieves the X values of the 1st curve
d.getCurvesInfo().CurveYvalue[curveIndex-1]            # Retrieves the Y values of the 1st curve
curvePoint = 1                                         # Point of the curve selected
x_y_values = [10, 400]                                 # X and Y values selected
d.setCurveValue(curveIndex, curvePoint, x_y_values)    # Sets the X and Y values of the 1st point on the 1st curve
d.getCurvesInfo().CurveXvalue[curveIndex-1]
d.getCurvesInfo().CurveYvalue[curveIndex-1]
See also getCurveValue, setCurve, getCurvesInfo.

setDemandModel(code, pmin, preq, pexp)[source]
Sets the type of demand model to use and its parameters.

Parameters
:
code (str) – Type of demand model * ‘DDA’ = Demand driven analysis (in which case the remaining three parameter values are ignored) * ‘PDA’ = Pressure driven analysis

pmin (float) – Pressure below which there is no demand

preq (float) – Pressure required to deliver full demand

pexp (float) – Pressure exponent in demand function

Returns
:
None

Example:

d.getDemandModel().disp()                  # Print the demand model
type = 'PDA'
pmin = 0
preq = 0.1
pexp = 0.5
d.setDemandModel(type, pmin, preq, pexp)   # Sets the demand model
d.getDemandModel().to_dict()
See also getDemandModel, setNodeBaseDemands, setNodeJunctionDemandName, addNodeJunctionDemand, deleteNodeJunctionDemand.

setFlowUnitsAFD(*argv)[source]
Sets flow units to AFD(Acre-Feet per Day).

Example:

d.setFlowUnitsAFD()   # d.setFlowUnitsAFD('NET1_AFD.inp')
d.getFlowUnits()
See also setFlowUnitsCFS, setFlowUnitsIMGD.

setFlowUnitsCFS(*argv)[source]
Sets flow units to CFS(Cubic Feet per Second).

Example:

d.setFlowUnitsCFS()   # d.setFlowUnitsCFS('NET1_CFS.inp')
d.getFlowUnits()
See also setFlowUnitsAFD, setFlowUnitsIMGD.

setFlowUnitsCMD(*argv)[source]
Sets flow units to CMD(Cubic Meters per Day).

Example:

d.setFlowUnitsCMD()  #  d.setFlowUnitsCMD('NET1_CMD.inp')
d.getFlowUnits()
See also setFlowUnitsMLD, setFlowUnitsCMH.

setFlowUnitsCMH(*argv)[source]
Sets flow units to CMH(Cubic Meters per Hour).

Example:

d.setFlowUnitsCMH()   # d.setFlowUnitsCMH('NET1_CMH.inp')
d.getFlowUnits()
See also setFlowUnitsMLD, setFlowUnitsCMD.

setFlowUnitsGPM(*argv)[source]
Sets flow units to GPM(Gallons Per Minute).

Example:

d.setFlowUnitsGPM()   # d.setFlowUnitsGPM('NET1_GPM.inp')
d.getFlowUnits()
See also setFlowUnitsLPS, setFlowUnitsMGD.

setFlowUnitsIMGD(*argv)[source]
Sets flow units to IMGD(Imperial Million Gallons per Day).

Example:

d.setFlowUnitsIMGD()   # d.setFlowUnitsIMGD('NET1_IMGD.inp')
d.getFlowUnits()
See also setFlowUnitsMGD, setFlowUnitsCFS.

setFlowUnitsLPM(*argv)[source]
Sets flow units to LPM(Liters Per Minute).

Example:

d.setFlowUnitsLPM()   #  d.setFlowUnitsLPM('NET1_LPM.inp')
d.getFlowUnits()
See also setFlowUnitsAFD, setFlowUnitsMLD.

setFlowUnitsLPS(*argv)[source]
Sets flow units to LPS(Liters Per Second).

Example:

d.setFlowUnitsLPS()   #  d.setFlowUnitsLPS('NET1_LPS.inp')
d.getFlowUnits()
See also setFlowUnitsGPM, setFlowUnitsMGD.

setFlowUnitsMGD(*argv)[source]
Sets flow units to MGD(Million Gallons per Day).

Example:

d.setFlowUnitsMGD()   #  d.setFlowUnitsMGD('NET1_MGD.inp')
d.getFlowUnits()
See also setFlowUnitsGPM, setFlowUnitsLPS.

setFlowUnitsMLD(*argv)[source]
Sets flow units to MLD(Million Liters per Day).

Example:

d.setFlowUnitsMLD()   #  d.setFlowUnitsMLD('NET1_MLD.inp')
d.getFlowUnits()
See also setFlowUnitsLPM, setFlowUnitsCMH.

setLinkBulkReactionCoeff(value, *argv)[source]
Sets the value of bulk chemical reaction coefficient.

Example 1:

index_pipe = 1
d.getLinkBulkReactionCoeff(index_pipe)              # Retrieves the bulk chemical reaction coefficient of the 1st link
coeff = 0
d.setLinkBulkReactionCoeff(index_pipe, coeff)       # Sets the bulk chemical reaction coefficient of the 1st link
d.getLinkBulkReactionCoeff(index_pipe)
Example 2:

coeffs = d.getLinkBulkReactionCoeff()               # Retrieves the bulk chemical reaction coefficients of all links
coeffs_new = [0 for i in coeffs]
d.setLinkBulkReactionCoeff(coeffs_new)              # Sets the bulk chemical reaction coefficient of all links
d.getLinkBulkReactionCoeff()
See also getLinkBulkReactionCoeff, setLinkRoughnessCoeff, setLinkPipeData, addLink, deleteLink.

setLinkComment(value, *argv)[source]
Sets the comment string assigned to the link object.

Example 1:

linkIndex = 1
d.getLinkComment(linkIndex)
comment = 'This is a link'
d.setLinkComment(linkIndex, comment)   # Sets a comment to the 1st link
d.getLinkComment(linkIndex)
Example 2:

linkIndex = [1, 2]
d.getLinkComment(linkIndex)
comment = ['This is link 1', 'This is link 2']
d.setLinkComment(linkIndex, comment)   # Sets comments to the first 2 links
d.getLinkComment(linkIndex)
See also getLinkComment, setLinkNameID, setLinkPipeData.

setLinkDiameter(value, *argv)[source]
Sets the values of diameters.

Example 1:

d.getLinkDiameter()                           # Retrieves the diameters of all links
index_pipe = 1
diameter = 20
d.setLinkDiameter(index_pipe, diameter)       # Sets the diameter of the 1st pipe
d.getLinkDiameter(index_pipe)
Example 2:

index_pipes = [1, 2]
diameters = [20, 25]
d.setLinkDiameter(index_pipes, diameters)     # Sets the diameters of the first 2 pipes
d.getLinkDiameter(index_pipes)
Example 3:

diameters = d.getLinkDiameter()
diameters = diameters * 1.5
d.setLinkDiameter(diameters)                  # Sets the diameters of all the links
d.getLinkDiameter()
See also setLinkPipeData, setLinkLength, setLinkBulkReactionCoeff, setLinkTypePipe.

setLinkInitialSetting(value, *argv)[source]
Sets the values of initial settings, roughness for pipes or initial speed for pumps or initial setting for valves.

Example 1:

index_pipe = 1
d.getLinkInitialSetting(index_pipe)                 # Retrieves the initial setting of the 1st link
setting = 80
d.setLinkInitialSetting(index_pipe, setting)        # Sets the initial setting of the 1st link
d.getLinkInitialSetting(index_pipe)
Example 2:

settings = d.getLinkInitialSetting()                # Retrieves the initial setting of all links
settings_new = settings + 140
d.setLinkInitialSetting(settings_new)               # Sets the initial setting of all links
d.getLinkInitialSetting()
See also getLinkInitialSetting, setLinkInitialStatus, setLinkRoughnessCoeff, setLinkPipeData, addLink, deleteLink.

setLinkInitialStatus(value, *argv)[source]
Sets the values of initial status.

Note: Cannot set status for a check valve

Example 1:

index_pipe = 1
d.getLinkInitialStatus(index_pipe)                # Retrieves the initial status of the 1st link
status = 0
d.setLinkInitialStatus(index_pipe, status)        # Sets the initial status of the 1st link
d.getLinkInitialStatus(index_pipe)
Example 2:

statuses = d.getLinkInitialStatus()                 # Retrieves the initial status of all links
statuses_new = np.zeros(len(statuses))
d.setLinkInitialStatus(statuses_new)                # Sets the initial status of all links
d.getLinkInitialStatus()
See also getLinkInitialStatus, setLinkInitialSetting, setLinkDiameter, setLinkPipeData, addLink, deleteLink.

setLinkLength(value, *argv)[source]
Sets the values of lengths.

Example 1:

index_pipe = 1
d.getLinkLength(index_pipe)                   # Retrieves the length of the 1st link
length_pipe = 100
d.setLinkLength(index_pipe, length_pipe)      # Sets the length of the 1st link
d.getLinkLength(index_pipe)
Example 2:

lengths = d.getLinkLength()                   # Retrieves the lengths of all the links
lengths_new = [i * 1.5 for i in lengths]
d.setLinkLength(lengths_new)                  # Sets the new lengths of all links
d.getLinkLength()
See also getLinkLength, setLinkDiameter, setLinkMinorLossCoeff, setLinkPipeData, addLink, deleteLink.

setLinkMinorLossCoeff(value, *argv)[source]
Sets the values of minor loss coefficient.

Example 1:

index_pipe = 1
d.getLinkMinorLossCoeff(index_pipe)               # Retrieves the minor loss coefficient of the 1st link
coeff = 105
d.setLinkMinorLossCoeff(index_pipe, coeff)        # Sets the minor loss coefficient of the 1st link
d.getLinkMinorLossCoeff(index_pipe)
Example 2:

coeffs = d.getLinkMinorLossCoeff()                # Retrieves the minor loss coefficients of all the links
coeffs_new = coeffs + 0.2
d.setLinkMinorLossCoeff(coeffs_new)               # Sets the minor loss coefficient of all links
d.getLinkMinorLossCoeff()
See also getLinkMinorLossCoeff, setLinkDiameter, setLinkRoughnessCoeff, setLinkPipeData, addLink, deleteLink.

setLinkNameID(value, *argv)[source]
Sets the ID name for links.

Example 1:

index_pipe = 1
d.getLinkNameID(index_pipe)         # Retrieves the ID of the 1st link
linkID = 'New_ID'                   # ID selected without a space in between the letters
d.setLinkNameID(index_pipe, linkID) # Sets the ID name of the 1st link
d.getLinkNameID(index_pipe)
Example 2: (the size of the cell must equal to the number of links)

IDs = ['1', '2', '3', '4']          # Select the IDS of the first four links
d.setLinkNameID(IDs)                # Sets the ID names of the first four links
d.getLinkNameID()
See also getLinkNameID, setLinkComment, setLinkDiameter, setLinkPipeData, addLink, deleteLink.

setLinkNodesIndex(linkIndex, startNode, endNode)[source]
Sets the indexes of a link’s start- and end-nodes.

Example 1: Sets to the 1st link the start-node index = 2 and end-node index = 3

d.getLinkNodesIndex()   # Retrieves the indexes of the from/to nodes of all links
linkIndex = 1
startNode = 2
endNode   = 3
d.setLinkNodesIndex(linkIndex, startNode, endNode)
d.getLinkNodesIndex()
Example 2: Sets to the 1st link the start-node index = 2 and end-node index = 3 and to 2nd link the start-node index = 4 and end-node index = 5.

linkIndex = [1, 2]
startNode = [2, 4]
endNode   = [3, 5]
d.setLinkNodesIndex(linkIndex, startNode, endNode)
d.getLinkNodesIndex()
See also getLinkNodesIndex, setLinkDiameter, setLinkLength, setLinkNameID, setLinkComment.

setLinkPipeData(Index, Length, Diameter, RoughnessCoeff, MinorLossCoeff)[source]
Sets a group of properties for a pipe.

Parameters
:
Index (int) – Pipe Index

Length (float) – Pipe length

Diameter (float) – Pipe diameter

RoughnessCoeff (float) – Pipe roughness coefficient

MinorLossCoeff (float) – Pipe minor loss coefficient

Returns
:
None

Example: Sets to the 1st pipe the following properties.

pipeIndex = 1
length = 1000
diameter = 20
RoughnessCoeff = 110
MinorLossCoeff = 0.2
d.getLinksInfo()    # Retrieves all link info
d.setLinkPipeData(pipeIndex, length, diameter, RoughnessCoeff, MinorLossCoeff)
d.getLinksInfo()
Example 2: Sets to the 1st and 2nd pipe the following properties.

pipeIndex = [1, 2]
length = [1000, 1500]
diameter = [20, 23]
RoughnessCoeff = [110, 115]
MinorLossCoeff = [0.2, 0.3]
d.getLinksInfo().disp()    # Retrieves all link info
d.setLinkPipeData(pipeIndex, length, diameter, RoughnessCoeff, MinorLossCoeff)
d.getLinksInfo().to_dict()
See also getLinksInfo, setLinkComment, setLinkDiameter, setLinkLength, setLinkStatus, setNodeTankData.

setLinkPumpECost(value, *argv)[source]
Sets the pump average energy price.

The examples are based on d = epanet(‘Net3_trace.inp’)

Example 1:

d.getLinkPumpECost()                           # Retrieves the pump average energy price of all pumps
d.setLinkPumpECost(0.10)                       # Sets the pump average energy price = 0.10 to every pump
d.getLinkPumpECost()
Example 2: (The input array must have a length equal to the number of pumps).

d.setLinkPumpECost([0.10, 0.12])               # Sets the pump average energy price = 0.10 and 0.12 to the 2 pumps
d.getLinkPumpECost()
Example 3:

d.setLinkPumpECost(1, 0.10)                    # Sets the pump average energy price = 0.10 to the 1st pump
d.getLinkPumpECost()
Example 4:

pumpIndex = d.getLinkPumpIndex()
d.setLinkPumpECost(pumpIndex, 0.10)            # Sets the pump average energy price = 0.10 to the pumps with index 118 and 119
d.getLinkPumpECost()
Example 5:

pumpIndex = d.getLinkPumpIndex()
d.setLinkPumpECost(pumpIndex, [0.10, 0.12])    # Sets the pump average energy price = 0.10 and 0.12 to the pumps with index 118 and 119 respectively
d.getLinkPumpECost()
See also getLinkPumpECost, setLinkPumpPower, setLinkPumpHCurve, setLinkPumpECurve, setLinkPumpEPat.

setLinkPumpECurve(value, *argv)[source]
Sets the pump efficiency v. flow curve index.

The examples are based on d = epanet(‘Net3_trace.inp’)

Example 1:

d.getLinkPumpECurve()                    # Retrieves the pump efficiency v. flow curve index of all pumps
d.setLinkPumpECurve(1)                   # Sets the pump efficiency v. flow curve index = 1 to every pump
d.getLinkPumpECurve()
Example 2: The input array must have a length equal to the number of pumps.

d.setLinkPumpECurve([1, 2])              # Sets the pump efficiency v. flow curve index = 1 and 2 to the 2 pumps
d.getLinkPumpECurve()
Example 3:

d.setLinkPumpECurve(1, 2)                # Sets the pump efficiency v. flow curve index = 2 to the 1st pump
d.getLinkPumpECurve()
Example 4:

pumpIndex = d.getLinkPumpIndex()
d.setLinkPumpECurve(pumpIndex, 1)        # Sets the pump efficiency v. flow curve index = 1 to the pumps with index 118 and 119
d.getLinkPumpECurve()
Example 5:

pumpIndex = d.getLinkPumpIndex()
d.setLinkPumpECurve(pumpIndex,[1, 2])    # Sets the pump efficiency v. flow curve index = 1 and 2 to the pumps with index 118 and 119 respectively
d.getLinkPumpECurve()
See also getLinkPumpECurve, setLinkPumpPower, setLinkPumpHCurve, setLinkPumpECost, setLinkPumpEPat.

setLinkPumpEPat(value, *argv)[source]
Sets the pump energy price time pattern index.

The examples are based on d = epanet(‘Net3_trace.inp’)

Example 1:

d.getLinkPumpEPat()                    # Retrieves the pump energy price time pattern index of all pumps
d.setLinkPumpEPat(1)                   # Sets the pump energy price time pattern index = 1 to every pump
d.getLinkPumpEPat()
Example 2: (The input array must have a length equal to the number of pumps).

d.setLinkPumpEPat([1, 2])              # Sets the pump energy price time pattern index = 1 and 2 to the 2 pumps
d.getLinkPumpEPat()
Example 3:

d.setLinkPumpEPat(1, 2)                # Sets the pump energy price time pattern index = 2 to the 1st pump
d.getLinkPumpEPat()
Example 4:

pumpIndex = d.getLinkPumpIndex()
d.setLinkPumpEPat(pumpIndex, 1)        # Sets the pump energy price time pattern index = 1 to the pumps with index 118 and 119
d.getLinkPumpEPat()
Example 5:

pumpIndex = d.getLinkPumpIndex()
d.setLinkPumpEPat(pumpIndex,[1, 2])    # Sets the pump energy price time pattern index = 1 and 2 to the pumps with index 118 and 119 respectively
d.getLinkPumpEPat()
See also getLinkPumpEPat, setLinkPumpPower, setLinkPumpHCurve, setLinkPumpECurve, setLinkPumpECost.

setLinkPumpHCurve(value, *argv)[source]
Sets the pump head v. flow curve index.

The examples are based on d = epanet(‘Net3_trace.inp’)

Example 1:

d.getLinkPumpHCurve()                    # Retrieves the pump head v. flow curve index of all pumps
d.setLinkPumpHCurve(1)                   # Sets the pump head v. flow curve index = 1 to every pump
d.getLinkPumpHCurve()
Example 2: (The input array must have a length equal to the number of pumps

d.setLinkPumpHCurve([1, 2])              # Sets the pump head v. flow curve index = 1 and 2 to the 2 pumps
d.getLinkPumpHCurve()
Example 3:

d.setLinkPumpHCurve(1, 2)                # Sets the pump head v. flow curve index = 2 to the 1st pump
d.getLinkPumpHCurve()
Example 4:

pumpIndex = d.getLinkPumpIndex()
d.setLinkPumpHCurve(pumpIndex, 1)        # Sets the pump head v. flow curve index = 1 to the pumps with index 118 and 119
d.getLinkPumpHCurve()
Example 5:

pumpIndex = d.getLinkPumpIndex()
d.setLinkPumpHCurve(pumpIndex, [1, 2])   # Sets the pump head v. flow curve index = 1 and 2 to the pumps with index 118 and 119 respectively
d.getLinkPumpHCurve()
See also getLinkPumpHCurve, setLinkPumpPower, setLinkPumpECurve, setLinkPumpECost, setLinkPumpEPat.

setLinkPumpHeadCurveIndex(value, *argv)[source]
Sets the curves index for pumps index

d.getLinkPumpHeadCurveIndex()
pumpIndex = d.getLinkPumpIndex(1)
curveIndex = d.getLinkCurveIndex(2)
d.setLinkPumpHeadCurveIndex(pumpIndex, curveIndex)
d.getLinkPumpHeadCurveIndex()
See also setLinkPumpPatternIndex, getLinkPumpPower, setLinkPumpHCurve, setLinkPumpECurve, setLinkPumpECost.

setLinkPumpPatternIndex(value, *argv)[source]
Sets the pump speed time pattern index.

The examples are based on d = epanet(‘Net3_trace.inp’)

Example 1:

d.getLinkPumpPatternIndex()                    # Retrieves the pump speed time pattern index of all pumps
d.setLinkPumpPatternIndex(1)                   # Sets the speed time pattern index = 1 to every pump
d.getLinkPumpPatternIndex()
Example 2: The input array must have a length equal to the number of pumps.

d.setLinkPumpPatternIndex([1, 2])              # Sets the pump speed time pattern index = 1 and 2 to the 2 pumps
d.getLinkPumpPatternIndex()
Example 3:

d.setLinkPumpPatternIndex(1, 2)                # Sets the pump speed time pattern index = 2 to the 1st pump
d.getLinkPumpPatternIndex()
Example 4:

pumpIndex = d.getLinkPumpIndex()
d.setLinkPumpPatternIndex(pumpIndex, 1)        # Sets the pump speed time pattern index = 1 to the pumps with index 118 and 119
d.getLinkPumpPatternIndex()
Example 5:

pumpIndex = d.getLinkPumpIndex()
d.setLinkPumpPatternIndex(pumpIndex, [1, 2])    # Sets the pump speed time pattern index = 1 and 2 to the pumps with index 118 and 119 respectively
d.getLinkPumpPatternIndex()
Example 6: To remove the pattern index from the pumps you can use input 0.

pumpIndex = d.getLinkPumpIndex()
d.setLinkPumpPatternIndex(pumpIndex, 0)
See also getLinkPumpPatternIndex, setLinkPumpPower, setLinkPumpHCurve, setLinkPumpECurve, setLinkPumpECost.

setLinkPumpPower(value, *argv)[source]
Sets the power for pumps.

The examples are based on d = epanet(‘Net3_trace.inp’)

Example 1:

d.getLinkPumpPower()                      # Retrieves the power of all pumps
d.setLinkPumpPower(10)                    # Sets the pump power = 10 to every pump
d.getLinkPumpPower()
Example 2: (The input array must have a length equal to the number of pumps).

d.setLinkPumpPower([10, 15])              # Sets the pump power = 10 and 15 to the 2 pumps
d.getLinkPumpPower()
Example 3:

d.setLinkPumpPower(1, 10)                 # Sets the pump power = 10 to the 1st pump
d.getLinkPumpPower()
Example 4:

pumpIndex = d.getLinkPumpIndex()
d.setLinkPumpPower(pumpIndex, 10)         # Sets the pump power = 10 to the pumps with index 118 and 119
d.getLinkPumpPower()
Example 5:

pumpIndex = d.getLinkPumpIndex()
d.setLinkPumpPower(pumpIndex, [10, 15])   # Sets the pump power = 10 and 15 to the pumps with index 118 and 119 respectively
d.getLinkPumpPower()
See also getLinkPumpPower, setLinkPumpHCurve, setLinkPumpECurve, setLinkPumpECost, setLinkPumpEPat.

setLinkRoughnessCoeff(value, *argv)[source]
Sets the values of roughness coefficient.

Example 1:

index_pipe = 1
d.getLinkRoughnessCoeff(index_pipe)               # Retrieves the roughness coefficient of the 1st link
coeff = 105
d.setLinkRoughnessCoeff(index_pipe, coeff)        # Sets the roughness coefficient of the 1st link
d.getLinkRoughnessCoeff(index_pipe)
Example 2:

coeffs = d.getLinkRoughnessCoeff()                  # Retrieves the roughness coefficients of all the links
coeffs_new = coeffs + 10
d.setLinkRoughnessCoeff(coeffs_new)               # Sets the roughness coefficient of all links
d.getLinkRoughnessCoeff()
See also getLinkRoughnessCoeff, setLinkDiameter, setLinkMinorLossCoeff, setLinkPipeData, addLink, deleteLink.

setLinkSettings(value, *argv)[source]
Sets the values of current settings, roughness for pipes or initial speed for pumps or initial setting for valves.

Example 1:

index_pipe = 1
d.getLinkSettings(index_pipe)                 # Retrieves the current setting of the 1st link
setting = 80
d.setLinkSettings(index_pipe, setting)        # Sets the current setting of the 1st link
d.getLinkSettings(index_pipe)
Example 2:

settings = d.getLinkSettings()                # Retrieves the current setting of all links
settings_new = [i + 40 for i in settings]
d.setLinkSettings(settings_new)               # Sets the current setting of all links
d.getLinkSettings()
See also getLinkSettings, setLinkStatus, setLinkRoughnessCoeff,
setLinkPipeData, addLink, deleteLink.

setLinkStatus(value, *argv)[source]
Sets the values of current status for links.

Note: Cannot set status for a check valve

Example 1:

index_pipe = 1
d.getLinkStatus(index_pipe)                  # Retrieves the current status of the 1st link
status = 1
d.setLinkStatus(index_pipe, status)          # Sets the current status of the 1st link
d.getLinkStatus(index_pipe)
Example 2:

statuses = d.getLinkStatus()                 # Retrieves the current status of all links
statuses_new = [0 for i in statuses]
d.setLinkStatus(statuses_new)                # Sets the current status of all links
d.getLinkStatus()
See also getLinkStatus, setLinkInitialStatus, setLinkDiameter, setLinkPipeData, addLink, deleteLink.

setLinkTypePipe(Id, *argv)[source]
Sets the link type pipe for a specified link.

Note:
condition = 0 | if is EN_UNCONDITIONAL: Delete all controls that contain object

condition = 1 | if is EN_CONDITIONAL: Cancel object type change if contained in controls

Default condition is 0.

Example 1:

d.getLinkType()
linkid = d.getLinkPumpNameID(1)
index = d.setLinkTypePipe(linkid)            # Changes the 1st pump to pipe given it's ID
d.getLinkType(index)
Example 2:

linkid = d.getLinkPumpNameID(1)
condition = 1
index = d.setLinkTypePipe(linkid, condition) # Changes the 1st pump to pipe given it's ID and a condition (if possible)
d.getLinkType(index)
See also getLinkType, getLinkPumpNameID, setLinkTypePipeCV, setLinkTypePump, setLinkTypeValveFCV.

setLinkTypePipeCV(Id, *argv)[source]
Sets the link type cvpipe(pipe with check valve) for a specified link.

Note:
condition = 0 | if is EN_UNCONDITIONAL: Delete all controls that contain object

condition = 1 | if is EN_CONDITIONAL: Cancel object type change if contained in controls

Default condition is 0.

Example 1:

d.getLinkType(1)                              # Retrieves the type of the 1st link
linkid = d.getLinkPipeNameID(1)               # Retrieves the ID of the 1t pipe
index = d.setLinkTypePipeCV(linkid)           # Changes the 1st pipe to cvpipe given it's ID
d.getLinkType(index)
Example 2:

linkid = d.getLinkPipeNameID(1)
condition = 1
index = d.setLinkTypePipeCV(linkid, condition)  # Changes the 1st pipe to cvpipe given it's ID and a condition (if possible)
d.getLinkType(index)
See also getLinkType, getLinkPipeNameID, setLinkTypePipe, setLinkTypePump, setLinkTypeValveFCV.

setLinkTypePump(Id, *argv)[source]
Sets the link type pump for a specified link.

Note:
condition = 0 | if is EN_UNCONDITIONAL: Delete all controls that contain object

condition = 1 | if is EN_CONDITIONAL: Cancel object type change if contained in controls

Default condition is 0.

Example 1:

d.getLinkType(1)                            # Retrieves the type of the 1st link
linkid = d.getLinkPipeNameID(1)             # Retrieves the ID of the 1t pipe
index = d.setLinkTypePump(linkid)           # Changes the 1st pipe to pump given it's ID
d.getLinkType(index)
Example 2:

linkid = d.getLinkPipeNameID(1)
condition = 1
index = d.setLinkTypePump(linkid, condition)   # Changes the 1st pipe to pump given it's ID and a condition (if possible)
d.getLinkType(index)
See also getLinkType, getLinkPipeNameID, setLinkTypePipe, setLinkTypePipeCV, setLinkTypeValveFCV.

setLinkTypeValveFCV(Id, *argv)[source]
Sets the link type valve FCV(flow control valve) for a specified link.

Note:
condition = 0 | if is EN_UNCONDITIONAL: Delete all controls that contain object

condition = 1 | if is EN_CONDITIONAL: Cancel object type change if contained in controls

Default condition is 0.

Example 1:

d.getLinkType(1)                                    # Retrieves the type of the 1st link
linkid = d.getLinkPipeNameID(1)                     # Retrieves the ID of the 1t pipe
index = d.setLinkTypeValveFCV(linkid)               # Changes the 1st pipe to valve FCV given it's ID
d.getLinkType(index)
Example 2:

linkid = d.getLinkPipeNameID(1)
condition = 1
index = d.setLinkTypeValveFCV(linkid, condition)    # Changes the 1st pipe to valve FCV given it's ID and a condition (if possible)
d.getLinkType(index)
See also getLinkType, getLinkPipeNameID, setLinkTypePipe, setLinkTypePump, setLinkTypeValveGPV.

setLinkTypeValveGPV(Id, *argv)[source]
Sets the link type valve GPV(general purpose valve) for a specified link.

Note:
condition = 0 | if is EN_UNCONDITIONAL: Delete all controls that contain object

condition = 1 | if is EN_CONDITIONAL: Cancel object type change if contained in controls

Default condition is 0.

Example 1:

d.getLinkType(1)                                    # Retrieves the type of the 1st link
linkid = d.getLinkPipeNameID(1)                     # Retrieves the ID of the 1t pipe
index = d.setLinkTypeValveGPV(linkid)               # Changes the 1st pipe to valve GPV given it's ID
d.getLinkType(index)
Example 2:

linkid = d.getLinkPipeNameID(1)
condition = 1
index = d.setLinkTypeValveGPV(linkid, condition)    # Changes the 1st pipe to valve GPV given it's ID and a condition (if possible)
d.getLinkType(index)
See also getLinkType, getLinkPipeNameID, setLinkTypePipe, setLinkTypePump, setLinkTypeValveFCV.

setLinkTypeValvePBV(Id, *argv)[source]
Sets the link type valve PBV(pressure breaker valve) for a specified link.

Note:
condition = 0 | if is EN_UNCONDITIONAL: Delete all controls that contain object

condition = 1 | if is EN_CONDITIONAL: Cancel object type change if contained in controls

Default condition is 0.

Example 1:

d.getLinkType(1)                                    # Retrieves the type of the 1st link
linkid = d.getLinkPipeNameID(1)                     # Retrieves the ID of the 1t pipe
index = d.setLinkTypeValvePBV(linkid)               # Changes the 1st pipe to valve PBV given it's ID
d.getLinkType(index)
Example 2:

linkid = d.getLinkPipeNameID(1)
condition = 1
index = d.setLinkTypeValvePBV(linkid, condition)    # Changes the 1st pipe to valve PBV given it's ID and a condition (if possible)
d.getLinkType(index)
See also getLinkType, getLinkPipeNameID, setLinkTypePipe, setLinkTypePump, setLinkTypeValvePRV.

setLinkTypeValvePRV(Id, *argv)[source]
Sets the link type valve PRV(pressure reducing valve) for a specified link.

Note:
condition = 0 | if is EN_UNCONDITIONAL: Delete all controls that contain object

condition = 1 | if is EN_CONDITIONAL: Cancel object type change if contained in controls

Default condition is 0.

Example 1:

d.getLinkType(1)                                    # Retrieves the type of the 1st link
linkid = d.getLinkPipeNameID(1)                     # Retrieves the ID of the 1t pipe
index = d.setLinkTypeValvePRV(linkid)               # Changes the 1st pipe to valve PRV given it's ID
d.getLinkType(index)
Example 2:

linkid = d.getLinkPipeNameID(1)
condition = 1
index = d.setLinkTypeValvePRV(linkid, condition)    # Changes the 1st pipe to valve PRV given it's ID and a condition (if possible)
d.getLinkType(index)
See also getLinkType, getLinkPipeNameID, setLinkTypePipe, setLinkTypePump, setLinkTypeValvePSV.

setLinkTypeValvePSV(Id, *argv)[source]
Sets the link type valve PSV(pressure sustaining valve) for a specified link.

Note:
condition = 0 | if is EN_UNCONDITIONAL: Delete all controls that contain object

condition = 1 | if is EN_CONDITIONAL: Cancel object type change if contained in controls

Default condition is 0.

Example 1:

d.getLinkType(1)                                    # Retrieves the type of the 1st link
linkid = d.getLinkPipeNameID(1)                     # Retrieves the ID of the 1t pipe
index = d.setLinkTypeValvePSV(linkid)               # Changes the 1st pipe to valve PSV given it's ID
d.getLinkType(index)
Example 2:

linkid = d.getLinkPipeNameID(1)
condition = 1
index = d.setLinkTypeValvePSV(linkid, condition)    # Changes the 1st pipe to valve PSV given it's ID and a condition (if possible)
d.getLinkType(index)
See also getLinkType, getLinkPipeNameID, setLinkTypePipe, setLinkTypePump, setLinkTypeValvePBV.

setLinkTypeValveTCV(Id, *argv)[source]
Sets the link type valve TCV(throttle control valve) for a specified link.

Note:
condition = 0 | if is EN_UNCONDITIONAL: Delete all controls that contain object

condition = 1 | if is EN_CONDITIONAL: Cancel object type change if contained in controls

Default condition is 0.

Example 1:

d.getLinkType(1)                                    # Retrieves the type of the 1st link
linkid = d.getLinkPipeNameID(1)                     # Retrieves the ID of the 1t pipe
index = d.setLinkTypeValveTCV(linkid)               # Changes the 1st pipe to valve TCV given it's ID
d.getLinkType(index)
Example 2:

linkid = d.getLinkPipeNameID(1)
condition = 1
index = d.setLinkTypeValveTCV(linkid, condition)    # Changes the 1st pipe to valve TCV given it's ID and a condition (if possible)
d.getLinkType(index)
See also getLinkType, getLinkPipeNameID, setLinkTypePipe, setLinkTypePump, setLinkTypeValveGPV.

setLinkVertices(linkID, x, y, *argv)[source]
Assigns a set of internal vertex points to a link.

The example is based on d = epanet(‘Net1.inp’)

Example:

d = epanet('Net1.inp')
linkID = '10'
x = [22, 24, 28]
y = [69, 68, 69]
d.setLinkVertices(linkID, x, y)
See also getLinkVertices, getLinkVerticesCount.

setLinkWallReactionCoeff(value, *argv)[source]
Sets the value of wall chemical reaction coefficient.

Example 1:

index_pipe = 1
d.getLinkWallReactionCoeff(index_pipe)               # Retrieves the wall chemical reaction coefficient of the 1st link
coeff = 0
d.setLinkWallReactionCoeff(index_pipe, coeff)        # Sets the wall chemical reaction coefficient of the 1st link
d.getLinkWallReactionCoeff(index_pipe)
Example 2:

coeffs = d.getLinkWallReactionCoeff()                # Retrieves the wall chemical reaction coefficients of all links
coeffs_new = [0] * len(coeffs)
d.setLinkWallReactionCoeff(coeffs_new)               # Sets the wall chemical reaction coefficient of all links
d.getLinkWallReactionCoeff()
See also getLinkWallReactionCoeff, setLinkBulkReactionCoeff, setLinkPipeData, addLink, deleteLink.

setMSXAreaUnitsCM2()[source]
Sets the area units to square centimeters.

The default is FT2.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXAreaUnits() d.setMSXAreaUnitsCM2() d.getMSXAreaUnits()

See also setMSXAreaUnitsFT2, setMSXAreaUnitsM2.

setMSXAreaUnitsFT2()[source]
Sets the area units to square feet.

The default is FT2.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXAreaUnits() d.setMSXAreaUnitsFT2() d.getMSXAreaUnits()

See also setMSXAreaUnitsM2, setMSXAreaUnitsCM2.

setMSXAreaUnitsM2()[source]
Sets the area units to square meters.

The default is FT2.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXAreaUnits() d.setMSXAreaUnitsM2() d.getMSXAreaUnits()

See also setMSXAreaUnitsFT2, setMSXAreaUnitsCM2.

setMSXAtol(value)[source]
Sets the absolute tolerance used to determine when two concentration levels of a
species are the same.

If no ATOL option is specified then it defaults to 0.01 (regardless of species concentration units).

Example:
d = epanet(‘net2-cl2.inp’); d.loadMSXFile(‘net2-cl2.msx’); d.getMSXAtol() d.setMSXAtol(2e-3); d.getMSXAtol()

% See also setMSXRtol.

setMSXCompilerGC()[source]
Sets chemistry function compiler code to GC.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2-vc.msx’) d.getMSXCompiler() d.setMSXCompilerGC() d.getMSXCompiler()

See also setMSXCompilerNONE, setMSXCompilerVC.

setMSXCompilerNONE()[source]
Sets chemistry function compiler code to NONE.

Example:
d = epanet(‘net2-cl2.inp’); d.loadMSXFile(‘net2-cl2.msx’); d.getMSXCompiler() d.setMSXCompilerNONE() d.getMSXCompiler()

See also setMSXCompilerVC, setMSXCompilerGC.

setMSXCompilerVC()[source]
Sets chemistry function compiler code to VC.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXCompiler() d.setMSXCompilerVC() d.getMSXCompiler()

See also setMSXCompilerNONE, setMSXCompilerGC.

setMSXConstantsValue(value)[source]
Sets the values of constants.

Example:
d = epanet(‘net3-bio.inp’) d.loadMSXFile(‘net3-bio.msx’) d.getMSXConstantsValue() d.setMSXConstantsValue([1, 2, 3]) Set the values of the first three constants. d.getMSXConstantsValue()

See also getMSXConstantsCount, getMSXConstantsIndex,
getMSXConstantsNameID.

setMSXCouplingFULL()[source]
Sets coupling to FULL.

COUPLING determines to what degree the solution of any algebraic equilibrium equations is coupled to the integration of the reaction rate equations. With FULL coupling the updating is done whenever a new set of values for the rate-dependent variables in the reaction rate expressions is computed. The default is FULL coupling.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXCoupling() d.setMSXCouplingFULL() d.getMSXCoupling()

See also setMSXCouplingNONE.

setMSXCouplingNONE()[source]
Sets coupling to NONE.

COUPLING determines to what degree the solution of any algebraic equilibrium equations is coupled to the integration of the reaction rate equations. If coupling is NONE then the solution to the algebraic equations is only updated at the end of each integration time step. The default is FULL coupling.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXCoupling() d.setMSXCouplingFULL() d.getMSXCoupling()

See also setMSXCouplingFULL.

setMSXLinkInitqualValue(value)[source]
” Sets all links initial quality value.

Example:
linkIndex=0 speciesIndex=0 values = [[0] * linkIndex for _ in range(speciesIndex)] values=d.getMSXLinkInitqualValue() values[linkIndex][speciesIndex]=1500 d.setMSXLinkInitqualValue(values) x=d.getMSXLinkInitqualValue()

See also getMSXLinkInitqualValue, setMSXNodeInitqualValue.

setMSXNodeInitqualValue(value)[source]
Sets all nodes initial quality value.

Example:
linkIndex=0 speciesIndex=0 values = [[0] * linkIndex for _ in range(speciesIndex)] values=d.getMSXNodeInitqualValue() values[linkIndex][speciesIndex]=1500 d.setMSXNodeInitqualValue(values) x=d.getMSXNodeInitqualValue()

See also getMSXNodeInitqualValue, setMSXLinkInitqualValue.

setMSXParametersPipesValue(pipeIndex, paramOrValues, value=None)[source]
Assigns a value to one or multiple reaction parameters for a given pipe within the pipe network. Example 1:

d = epanet(‘net2-cl2.inp’); d.loadMSXFile(‘net2-cl2.msx’); x = d.getMSXParametersPipesValue() print(x[0]) d.setMSXParametersPipesValue(1, [1.5, 2]) x = d.getMSXParametersPipesValue() print(x[0])

Example 2:
d = epanet(‘net2-cl2.inp’); d.loadMSXFile(‘net2-cl2.msx’); x = d.getMSXParametersPipesValue() print(x[0]) d.setMSXParametersPipesValue(1, 2,5) x = d.getMSXParametersPipesValue() print(x[0])

See also getMSXParametersPipesValue, setMSXParametersTanksValue,
getMSXParametersTanksValue, getMSXParametersCount, getMSXParametersIndex.

setMSXParametersTanksValue(NodeTankIndex, paramOrValues, value=None)[source]
Assigns a value to one or multiple reaction parameters for a given tank within the pipe network.

Example 1:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) x=d.getMSXParametersTanksValue() print(x[35]) d.setMSXParametersTanksValue(36,[5,6]) x=d.getMSXParametersTanksValue() print(x[35])

Example 2:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) x = d.getMSXParametersTanksValue() print(x[35]) d.setMSXParametersTanksValue(36, 2,20) x = d.getMSXParametersTanksValue() print(x[35])

See also getMSXParametersTanksValue, setMSXParametersPipesValue,
getMSXParametersPipesValue, getMSXParametersCount, getMSXParametersIndex.

setMSXPattern(index, patternVector)[source]
Sets the multiplier at a specific time period for a given pattern.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.addMSXPattern(‘Pl’, [1.0 2.0 1.5 1.0]) d.getMSXPattern() d.setMSXPattern(1, [1.0 0.0 3.0]) d.getMSXPattern()

See also getMSXPattern, addMSXPattern.

setMSXPatternMatrix(pattern_matrix)[source]
Sets all of the multiplier factors for all patterns

Example:
inpname = os.path.join(os.getcwd(), ‘epyt’, ‘networks’,’msx-examples’, ‘net2-cl2.inp’) msxname = os.path.join(os.getcwd(), ‘epyt’, ‘networks’,’msx-examples’, ‘net2-cl2.msx’) d = epanet(inpname) d.loadMSXFile(msxname) d.addMSXPattern(‘1’,[]) d.setMSXPatternMatrix([.1,.2,.5,.2,1,.9]) print(d.getMSXPattern())

setMSXPatternValue(index, patternTimeStep, patternFactor)[source]
Sets the pattern factor for an index for a specific time step.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.addMSXPattern(‘P1’, [2.0 2.0 2.0 2.0]) d.getMSXPatternValue(1,1) d.setMSXPatternValue(1,1,3.0) Sets the first timestep of the first pattern to 3.0. d.getMSXPatternValue(1,1)

See also getMSXPatternValue, getMSXPattern, addMSXPattern.

setMSXRateUnitsDAY()[source]
Sets the rate units to days.

The default units are hours (HR)

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXRateUnits() d.setMSXRateUnitsDAY() d.getMSXRateUnits()

See also setMSXRateUnitsSEC, setMSXRateUnitsMIN
setMSXRateUnitsHR.

setMSXRateUnitsHR()[source]
Sets the rate units to hours.

The default units are hours (HR)

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXRateUnits() d.setMSXRateUnitsHR() d.getMSXRateUnits()

See also setMSXRateUnitsSEC, setMSXRateUnitsMIN
setMSXRateUnitsDAY.

setMSXRateUnitsMIN()[source]
Sets the rate units to minutes.

The default units are hours (HR)

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXRateUnits() d.setMSXRateUnitsMIN() d.getMSXRateUnits()

See also setMSXRateUnitsSEC, setMSXRateUnitsHR,
setMSXRateUnitsDAY.

setMSXRateUnitsSEC()[source]
Sets the rate units to seconds.

The default units are hours (HR)

Example: d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXRateUnits() d.setMSXRateUnitsSEC() d.getMSXRateUnits()

See also setMSXRateUnitsMIN, setMSXRateUnitsHR,
setMSXRateUnitsDAY.

setMSXRtol(value)[source]
Sets the relative accuracy level on a species’ concentration used to adjust time steps in the RK5 and ROS2 integration methods.

If no RTOL option is specified then it defaults to 0.001.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXRtol() d.setMSXRtol(2e-3) d.getMSXRtol()

See also setMSXAtol.

setMSXSolverEUL()[source]
Sets the numerical integration method to solve the reaction system to standard Euler integrator (EUL).

The default solver is EUL.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXSolver() d.setMSXSolverEUL() d.getMSXSolver()

See also setMSXSolverRK5, setMSXSolverROS2.

setMSXSolverRK5()[source]
Sets the numerical integration method to solve the reaction
system to Runge-Kutta 5th order integrator (RK5).

The default solver is EUL.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXSolver() d.setMSXSolverRK5() d.getMSXSolver()

% See also setMSXSolverEUL, setMSXSolverROS2.

setMSXSolverROS2()[source]
Sets the numerical integration method to solve the reaction system to 2nd order Rosenbrock integrator (ROS2).

The default solver is EUL.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXSolver() d.setMSXSolverROS2() d.getMSXSolver()

See also setMSXSolverEUL, setMSXSolverRK5.

setMSXSources(nodeID, speciesID, sourcetype, concentration, patID)[source]
Sets the attributes of an external source of a particular chemical species to a specific node of the pipe network.

Example:
d = epanet(‘net2-cl2.inp’); d.loadMSXFile(‘net2-cl2.msx’) srcs = d.getMSXSources() d.addMSXPattern(‘PatAsIII’,[2, .3, .4, 6, 5, 2, 4]) d.setMSXSources(d.NodeNameID{2}, d.MSXSpeciesNameID{1}, Setpoint’, 0.5, ‘PatAsIII’) % Sets the second node as setpoint. d.setMSXSources(d.getNodeNameID(2), d.getMSXSpeciesNameID([1]),’FLOWPACED’, 0.5, ‘PatAsIII’) srcs = d.getMSXSources()

See also getMSXSources, getMSXSourceNodeNameID, getMSXSourceType
getMSXSourceLevel, getMSXSourcePatternIndex.

setMSXTimeStep(value)[source]
Sets the time step.

The default timestep is 300 seconds (5 minutes).

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.getMSXTimeStep() d.setMSXTimeStep(3600) d.getMSXTimeStep()

See also getMSXTimeStep.

setNodeBaseDemands(value, *argv)[source]
Sets the values of demand for nodes. The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example 1:

index_node = 1
d.getNodeBaseDemands()[1][index_node]                      # Retrieves the demand of the 1st node
demand = 5
d.setNodeBaseDemands(index_node, demand)                   # Sets the demand of the 1st node
d.getNodeBaseDemands()[1][index_node-1]
Example 2:

nodeIndex = list(range(1,6))
BaseDems = d.getNodeBaseDemands()[1]
baseDems = list(np.array(BaseDems)[0:5])                   # Retrieves the demands of first 5 nodes
demands = [10, 5, 15, 20, 5]
d.setNodeBaseDemands(nodeIndex, demands)                   # Sets the demands of first 5 nodes
newBaseDems = d.getNodeBaseDemands()[1][0:5]
newbaseDems = newBaseDems
Example 3:

demands = d.getNodeBaseDemands()[1]                        # Retrieves the demands of all nodes
demands_new = [i+15 for i in demands]
d.setNodeBaseDemands(demands_new)                          # Sets the demands of all nodes
d.getNodeBaseDemands()[1]
If a category is not given, the default is categoryIndex = 1.

Example 4:

d = epanet('BWSN_Network_1.inp')
nodeIndex = 121
categoryIndex = 2
d.getNodeBaseDemands()[categoryIndex][nodeIndex-1]           # Retrieves the demand of the 2nd category of the 121th node
demand = 25
d.setNodeBaseDemands(nodeIndex, categoryIndex, demand)       # Sets the demand of the 2nd category of the 121th node
d.getNodeBaseDemands()[categoryIndex][nodeIndex-1]
Example 5:

d = epanet('BWSN_Network_1.inp')
nodeIndex = list(range(1,6))
categoryIndex = 1
baseDems = d.getNodeBaseDemands()[categoryIndex]
baseDems = baseDems[0:5]                       # Retrieves the demands of the 1st category of the first 5 nodes
demands = [10, 5, 15, 20, 5]
d.setNodeBaseDemands(nodeIndex, categoryIndex, demands)      # Sets the demands of the 1st category of the first 5 nodes
newbaseDems = d.getNodeBaseDemands()[categoryIndex]
newbaseDems = newbaseDems[0:5]
See also getNodeBaseDemands, setNodeJunctionDemandName, setNodeDemandPatternIndex, addNodeJunction, deleteNode.

setNodeComment(value, *argv)[source]
Sets the comment string assigned to the node object.

Example 1:

d.setNodeComment(1, 'This is a node')                     # Sets a comment to the 1st node
d.getNodeComment(1)
Example 2:

d.setNodeComment([1,2], ['This is a node', 'Test comm'])  # Sets a comment to the 1st and 2nd node
d.getNodeComment([1,2])
See also getNodeComment, getNodesInfo, setNodeNameID, setNodeCoordinates.

setNodeCoordinates(value, *argv)[source]
Sets node coordinates.

Example 1:

nodeIndex = 1
d.getNodeCoordinates(nodeIndex)              # Retrieves the X and Y coordinates of the 1st node
coords = [0,0]
d.setNodeCoordinates(nodeIndex, coords)      # Sets the coordinates of the 1st node
d.getNodeCoordinates(nodeIndex)
Example 2:

x_values = d.getNodeCoordinates('x')
y_values = d.getNodeCoordinates('y')
x_new = [x_values[i]+10 for i in x_values]
y_new = [y_values[i]+10 for i in y_values]
new_coords = [x_new, y_new]                     # Creates a cell array with the new coordinates
d.setNodeCoordinates(new_coords)                # Sets the coordinates of all nodes
x_values_new = d.getNodeCoordinates('x')
y_values_new = d.getNodeCoordinates('y')
See also getNodeCoordinates, setNodeElevations, plot, addNodeJunction, addNodeTank, deleteNode.

setNodeDemandPatternIndex(value, *argv)[source]
Sets the values of demand time pattern indices.

The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example 1:

nodeIndex = 1
d.getNodeDemandPatternIndex()[1][nodeIndex-1]                            # Retrieves the index of the 1st category's time pattern of the 1st node
patternIndex = 2
d.setNodeDemandPatternIndex(nodeIndex, patternIndex)                     # Sets the demand time pattern index to the 1st node
d.getNodeDemandPatternIndex()[1][nodeIndex-1]
Example 2:

nodeIndex = np.array(range(1,6))
d.getNodeDemandPatternIndex()[1][0:5]
patternIndices = [1, 3, 2, 4, 2]
d.setNodeDemandPatternIndex(nodeIndex, patternIndices)                   # Sets the demand time pattern index to the first 5 nodes
d.getNodeDemandPatternIndex()[1][0:5]
Example 3:

patternIndices = d.getNodeDemandPatternIndex()[1]
patternIndices_new = [i+1 for i in patternIndices]
d.setNodeDemandPatternIndex(patternIndices_new)                          # Sets all primary demand time pattern indices
d.getNodeDemandPatternIndex()[1]
If a category is not given, the default is categoryIndex = 1.

Example 4:

nodeIndex = 121
categoryIndex = 2
d.getNodeDemandPatternIndex()[categoryIndex][nodeIndex-1]                 # Retrieves the index of the 2nd category's time pattern of the 121th node
patternIndex = 4
d.setNodeDemandPatternIndex(nodeIndex, categoryIndex, patternIndex)       # Sets the demand time pattern index of the 2nd category of the 121th node
d.getNodeDemandPatternIndex()[categoryIndex][nodeIndex-1]
Example 5:

nodeIndex = np.array(range(1,6))
categoryIndex = 1
patDems = d.getNodeDemandPatternIndex()[categoryIndex]
patDems = list(np.array(patDems)[0:5])
patternIndices = [1, 3, 2, 4, 2]
d.setNodeDemandPatternIndex(nodeIndex, categoryIndex, patternIndices)     # Sets the demand time pattern index of the 1st category of the first 5 nodes
patDems_new = d.getNodeDemandPatternIndex()[categoryIndex][0:5]
See also getNodeDemandPatternIndex, getNodeDemandCategoriesNumber, setNodeBaseDemands, addPattern, deletePattern.

setNodeElevations(value, *argv)[source]
Sets the values of elevation for nodes.

Example 1:

index_node = 1
d.getNodeElevations(index_node)            # Retrieves the elevation of the 1st node
elev = 500
d.setNodeElevations(index_node, elev)      # Sets the elevation of the 1st node
d.getNodeElevations(index_node)
Example 2:

elevs = d.getNodeElevations()               # Retrieves the elevations of all the nodes
elevs_new = elevs + 100
d.setNodeElevations(elevs_new)              # Sets the elevations of all nodes
d.getNodeElevations()
See also getNodeElevations, setNodeCoordinates, setNodeBaseDemands, setNodeJunctionData, addNodeJunction, deleteNode.

setNodeEmitterCoeff(value, *argv)[source]
Sets the values of emitter coefficient for nodes.

Example 1:

nodeset = d.getNodeEmitterCoeff()                # Retrieves the value of all nodes emmitter coefficients
nodeset[0] = 0.1                                 # First node emitter coefficient = 0.1
d.setNodeEmitterCoeff(nodeset)                   # Sets the value of all nodes emitter coefficient
d.getNodeEmitterCoeff()
Example 2:

nodeIndex = 1
d.getNodeEmitterCoeff(nodeIndex)
emitterCoeff = 0
d.setNodeEmitterCoeff(nodeIndex, emitterCoeff)   # Sets the value of the 1st node emitter coefficient = 0
d.getNodeEmitterCoeff(nodeIndex)
See also getNodeEmitterCoeff, setNodeBaseDemands, setNodeJunctionData.

setNodeInitialQuality(value, *argv)[source]
Sets the values of initial quality for nodes.

Example 1:

nodeset = d.getNodeInitialQuality()                  # Retrieves the value of all nodes initial qualities
nodeset[0] = 0.5                                     # First node initial quality = 0.5
d.setNodeInitialQuality(nodeset)                     # Sets the values of all nodes initial quality
d.getNodeInitialQuality()
Example 2:

nodeIndex = 1
d.getNodeInitialQuality(nodeIndex)
initialQuality = 1
d.setNodeInitialQuality(nodeIndex, initialQuality)    # Sets the value of the 1st node initial quality
d.getNodeInitialQuality(nodeIndex)
See also getNodeInitialQuality, getNodeActualQuality, setNodeJunctionData.

setNodeJunctionData(index, elev, dmnd, dmndpat)[source]
Sets a group of properties for a junction node.

Parameters
:
index (int) – a junction node’s index (starting from 1).

elev (float) – the value of the junction’s elevation.

dmnd (float) – the value of the junction’s primary base demand.

dmndpat (str) – the ID name of the demand’s time pattern (”” for no pattern)

Returns
:
None

Example:

junctionIndex = 1
elev = 35
dmnd = 100
dmndpat = 'NEW_PATTERN'
d.addPattern(dmndpat)                                         # Adds a new pattern
d.setNodeJunctionData(junctionIndex, elev, dmnd, dmndpat)     # Sets the elevation, primary base demand and time pattern of the 1st junction
d.getNodeElevations(junctionIndex)                            # Retrieves the elevation of the 1st junction
d.getNodeBaseDemands(junctionIndex)                           # Retrieves the primary base demand of the 1st junction
d.getNodeDemandPatternNameID()[junctionIndex]                 # Retrieves the demand pattern ID (primary base demand is the first category)
See also setNodeTankData, getNodeElevations, getNodeBaseDemands, getNodeDemandPatternNameID, addPattern, setNodeJunctionDemandName.

setNodeJunctionDemandName(nodeIndex, demandIndex, demandName)[source]
Assigns a name to a node’s demand category.

Example:

nodeIndex = 1
demandIndex = 1
d.getNodeJunctionDemandName()[demandIndex][nodeIndex-1]              # Retrieves the name of the 1st node, 1st demand category
demandName = 'NEW NAME'
d.setNodeJunctionDemandName(nodeIndex, demandIndex, demandName)      # Sets a new name of the 1st node, 1st demand category
d.getNodeJunctionDemandName()[demandIndex][nodeIndex-1]
See also getNodeJunctionDemandName, setNodeBaseDemands, setDemandModel, addNodeJunctionDemand, deleteNodeJunctionDemand.

setNodeNameID(value, *argv)[source]
Sets the ID name for nodes.

Example 1:

nodeIndex = 1
d.getNodeNameID(nodeIndex)          # Retrieves the ID of the 1st node
nameID = 'newID'
d.setNodeNameID(nodeIndex, nameID)  # Sets the ID of the 1st node.
d.getNodeNameID(nodeIndex)
Example 2:

nameID = d.getNodeNameID()          # Retrieves the IDs of all nodes
nameID[0] = 'newID_1'
nameID[4] = 'newID_5'
d.setNodeNameID(nameID)             # Sets the IDs of all nodes
d.getNodeNameID()
See also getNodeNameID, setNodeComment, setNodeJunctionData.

setNodeReservoirHeadPatternIndex(value, *argv)[source]
Sets the pattern index for a reservoir node head This is a duplicate function—identical in behavior to setNodeDemandPatternIndex

Example 1:
d = epanet(‘net2-cl2.inp’) res_index = d.addNodeReservoir(“res-1”) pidx = d.addPattern(“pat-1”) d.setNodeReservoirHeadPatternIndex(res_index, pidx) d.setPattern(pidx, 1)

setNodeSourcePatternIndex(value, *argv)[source]
Sets the values of quality source pattern index.

Example 1:

nodeIndex = 1
d.getNodeSourcePatternIndex(nodeIndex)                        # Retrieves the quality source pattern index of the 1st node
sourcePatternIndex = 1
d.setNodeSourcePatternIndex(nodeIndex, sourcePatternIndex)    # Sets the quality source pattern index = 1 to the 1st node
d.getNodeSourcePatternIndex(nodeIndex)
Example 2:

nodeIndex = [1,2,3]
d.getNodeSourcePatternIndex(nodeIndex)                        # Retrieves the quality source pattern index of the first 3 nodes
sourcePatternIndex = [1, 1, 1]
d.setNodeSourcePatternIndex(nodeIndex, sourcePatternIndex)    # Sets the quality source pattern index = 1 to the first 3 nodes
d.getNodeSourcePatternIndex(nodeIndex)
See also getNodeSourcePatternIndex, setNodeSourceQuality, setNodeSourceType.

setNodeSourceQuality(value, *argv)[source]
Sets the values of quality source strength.

Example 1:

nodeIndex = 1
d.getNodeSourceQuality(nodeIndex)                    # Retrieves the quality source strength of the 1st node
sourceStrength = 10
d.setNodeSourceQuality(nodeIndex, sourceStrength)    # Sets the quality source strength = 10 to the 1st node
d.getNodeSourceQuality(nodeIndex)
Example 2:

nodeIndex = [1,2,3]
d.getNodeSourceQuality(nodeIndex)                    # Retrieves the quality source strength of the first 3 nodes
sourceStrength = [10, 12, 8]
d.setNodeSourceQuality(nodeIndex, sourceStrength)    # Sets the quality source strength = 10, 12 and 8 to the first 3 nodes
d.getNodeSourceQuality(nodeIndex)
See also getNodeSourceQuality, setNodeSourcePatternIndex, setNodeSourceType.

setNodeSourceType(index, value)[source]
Sets the values of quality source type.

Types of external water quality sources that can be set:
CONCEN Sets the concentration of external inflow entering a node

MASS Injects a given mass/minute into a node

SETPOINT Sets the concentration leaving a node to a given value

FLOWPACED Adds a given value to the concentration leaving a node

Example:

nodeIndex = 1
d.getNodeSourceType(nodeIndex)                 # Retrieves the quality source type of the 1st node
sourceType = 'MASS'
d.setNodeSourceType(nodeIndex, sourceType)     # Sets the quality source type = 'MASS' to the 1st node
d.getNodeSourceType(nodeIndex)
See also getNodeSourceType, setNodeSourceQuality, setNodeSourcePatternIndex.

setNodeTankBulkReactionCoeff(value, *argv)[source]
Sets the tank bulk reaction coefficient.

The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example 1:

d.getNodeTankBulkReactionCoeff()                          # Retrieves the  bulk reaction coefficient of all tanks
d.setNodeTankBulkReactionCoeff(-0.5)                      # Sets the bulk reaction coefficient = -0.5 to every tank
d.getNodeTankBulkReactionCoeff()
Example 2: (The input array must have a length equal to the number of tanks).

d.setNodeTankBulkReactionCoeff([0, -0.5])                 # Sets the bulk reaction coefficient = 0 and -0.5 to the 2 tanks
d.getNodeTankBulkReactionCoeff()
Example 3:

d.setNodeTankBulkReactionCoeff(1, -0.8)                   # Sets the bulk reaction coefficient = -0.5 to the 1st tank
d.getNodeTankBulkReactionCoeff()
Example 4:

tankIndex = d.getNodeTankIndex()
d.setNodeTankBulkReactionCoeff(tankIndex, 0)              # Sets the bulk reaction coefficient = 0 to the tanks with index 128 and 129
d.getNodeTankBulkReactionCoeff()
Example 5:

tankIndex = d.getNodeTankIndex([1,2])
d.setNodeTankBulkReactionCoeff(tankIndex, [-0.5, 0])      # Sets the bulk reaction coefficient = -0.5 and 0 to the tanks with index 128 and 129 respectively
d.getNodeTankBulkReactionCoeff()
See also getNodeTankBulkReactionCoeff, setNodeTankInitialLevel, setNodeTankMixingModelType, setNodeTankCanOverFlow, setNodeTankDiameter, setNodeTankData.

setNodeTankCanOverFlow(value, *argv)[source]
Sets the tank can-overflow (= 1) or not (= 0).

The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example 1:

d.getNodeTankCanOverFlow()               # Retrieves the can-overflow of all tanks
d.setNodeTankCanOverFlow(1)              # Sets the can-overflow = 1 to every tank
d.getNodeTankCanOverFlow()
Example 2: (The input array must have a length equal to the number of tanks).

d.setNodeTankCanOverFlow([1, 0])         # Sets the can-overflow = 1 and 0 to the 2 tanks
d.getNodeTankCanOverFlow()
Example 3:

d.setNodeTankCanOverFlow(1, 0)           # Sets the can-overflow = 0 to the 1st tank
d.getNodeTankCanOverFlow()
Example 4:

tankIndex = d.getNodeTankIndex()
d.setNodeTankCanOverFlow(tankIndex, 1)   # Sets the can-overflow = 1 to the tanks with index 128 and 129
d.getNodeTankCanOverFlow()
Example 5:

tankIndex = d.getNodeTankIndex()
d.setNodeTankCanOverFlow(tankIndex, [0, 1])   # Sets the can-overflow = 0 and 1 to the tanks with index 128 and 129 respectively
d.getNodeTankCanOverFlow()
See also getNodeTankCanOverFlow, setNodeTankBulkReactionCoeff, setNodeTankMinimumWaterLevel, setNodeTankMinimumWaterVolume, setNodeTankDiameter, setNodeTankData.

setNodeTankData(index, elev, intlvl, minlvl, maxlvl, diam, minvol, volcurve)[source]
Sets a group of properties for a tank.

Parameters
:
index (int) – Tank index

elev (float) – Tank Elevation

intlvl (float) – Tank Initial water Level

minlvl (float) – Tank Minimum Water Level

maxlvl (float) – Tank Maximum Water Level

diam (float) – Tank Diameter (0 if a volume curve is supplied)

minvol (float) – Tank Minimum Water Volume

volcurve (str) – Tank Volume Curve Index (”” for no curve)

Returns
:
None

The examples are based on d = epanet(‘Net3_trace.inp’)

Example 1: (Sets to the 1st tank the following properties).

tankIndex = 1    # You can also use tankIndex = 95 (i.e. the index of the tank).
elev = 100
intlvl = 13
minlvl =  0.2
maxlvl = 33
diam = 80
minvol = 50000
volcurve = ''    # For no curve
d.setNodeTankData(tankIndex, elev, intlvl, minlvl, maxlvl, diam, minvol, volcurve)
d.getNodeTankData().disp()
Example 2: (Sets to the 1st and 2nd tank the following properties).

tankIndex = [1, 2]    # You can also use tankIndex = [95, 96] (i.e. the indices of the tanks).
elev = [100, 105]
intlvl = [13, 13.5]
minlvl =  [0.2, 0.25]
maxlvl = [30, 35]
diam = [80, 85]
minvol = [50000, 60000]
volcurve = ['', '']    # For no curves
d.setNodeTankData(tankIndex, elev, intlvl, minlvl, maxlvl, diam, minvol, volcurve)
d.getNodeTankData(tankIndex).disp()
See also getNodeTankData, setNodeTankInitialLevel, setNodeTankMinimumWaterLevel, setNodeTankDiameter.

setNodeTankDiameter(value, *argv)[source]
Sets the diameter value for tanks.

The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example 1:

d.getNodeTankDiameter()                         #  Retrieves the diameter of all tanks
d.setNodeTankDiameter(120)                      #  Sets the diameter = 120 to every tank
d.getNodeTankDiameter()
Example 2: (The input array must have a length equal to the number of tanks).

d.setNodeTankDiameter([110, 130])               # Sets the diameter = 110 and 130 to the 2 tanks
d.getNodeTankDiameter()
Example 3:

d.setNodeTankDiameter(1, 120)                   # Sets the diameter = 120 to the 1st tank
d.getNodeTankDiameter()
Example 4:

tankIndex = d.getNodeTankIndex()
d.setNodeTankDiameter(tankIndex, 150)           # Sets the diameter = 150 to the tanks with index 128 and 129
d.getNodeTankDiameter()
Example 5:

tankIndex = d.getNodeTankIndex([1,2])
d.setNodeTankDiameter(tankIndex, [100, 120])    # Sets the diameter = 100 and 120 to the tanks with index 128 and 129 respectively
d.getNodeTankDiameter()
See also getNodeTankDiameter, setNodeTankInitialLevel, setNodeTankMinimumWaterLevel, setNodeTankBulkReactionCoeff, setNodeTankCanOverFlow, setNodeTankData.

setNodeTankInitialLevel(value, *argv)[source]
Sets the values of initial level for tanks.

The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example 1:

d.getNodeTankInitialLevel()                       # Retrieves the initial level of all tanks
d.setNodeTankInitialLevel(10)                     # Sets the initial level = 10 to every tank
d.getNodeTankInitialLevel()
Example 2: (The input array must have a length equal to the number of tanks).

d.setNodeTankInitialLevel([10, 15])               # Sets the initial level = 10 and 15 to the 2 tanks
d.getNodeTankInitialLevel()
Example 3:

d.setNodeTankInitialLevel(1, 10)                  # Sets the initial level = 10 to the 1st tank
d.getNodeTankInitialLevel()
Example 4:

tankIndex = d.getNodeTankIndex()
d.setNodeTankInitialLevel(tankIndex, 10)          # Sets the initial level = 10 to the tanks with index 128 and 129
d.getNodeTankInitialLevel()
Example 5:

tankIndex = d.getNodeTankIndex()
d.setNodeTankInitialLevel(tankIndex, [10, 15])    # Sets the initial level = 10 and 15 to the tanks with index 128 and 129 respectively
d.getNodeTankInitialLevel()
See also getNodeTankInitialLevel, setNodeTankMinimumWaterLevel, setNodeTankMaximumWaterLevel, setNodeTankMinimumWaterVolume, setNodeTankMixingFraction, setNodeTankData.

setNodeTankMaximumWaterLevel(value, *argv)[source]
Sets the maximum water level value for tanks.

The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example 1:

d.getNodeTankMaximumWaterLevel()                       # Retrieves the maximum water level of all tanks
d.setNodeTankMaximumWaterLevel(35)                     # Sets the maximum water level = 35 to every tank
d.getNodeTankMaximumWaterLevel()
Example 2: (The input array must have a length equal to the number of tanks).

d.setNodeTankMaximumWaterLevel([30, 40])               # Sets the maximum water level = 30 and 40 to the 2 tanks
d.getNodeTankMaximumWaterLevel()
Example 3:

d.setNodeTankMaximumWaterLevel(1, 35)                  # Sets the maximum water level = 35 to the 1st tank
d.getNodeTankMaximumWaterLevel()
Example 4:

tankIndex = d.getNodeTankIndex()
d.setNodeTankMaximumWaterLevel(tankIndex, 30)          # Sets the maximum water level = 30 to the tanks with index 128 and 129
d.getNodeTankMaximumWaterLevel()
Example 5:

tankIndex = d.getNodeTankIndex()
d.setNodeTankMaximumWaterLevel(tankIndex, [35, 45])    # Sets the maximum water level = 35 and 45 to the tanks with index 128 and 129 respectively
d.getNodeTankMaximumWaterLevel()
See also getNodeTankMaximumWaterLevel, setNodeTankInitialLevel, setNodeTankMinimumWaterLevel, setNodeTankMinimumWaterVolume, setNodeTankMixingFraction, setNodeTankData.

setNodeTankMinimumWaterLevel(value, *argv)[source]
Sets the minimum water level value for tanks.

The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example 1:

d.getNodeTankMinimumWaterLevel()                         # Retrieves the minimum water level of all tanks
d.setNodeTankMinimumWaterLevel(5)                        # Sets the minimum water level = 5 to every tank
d.getNodeTankMinimumWaterLevel()
Example 2: (The input array must have a length equal to the number of tanks).

d.setNodeTankMinimumWaterLevel([10, 15])                 # Sets the minimum water level = 10 and 15 to the 2 tanks
d.getNodeTankMinimumWaterLevel()
Example 3:

d.setNodeTankMinimumWaterLevel(1, 5)                     # Sets the minimum water level = 5 to the 1st tank
d.getNodeTankMinimumWaterLevel()
Example 4:

tankIndex = d.getNodeTankIndex()
d.setNodeTankMinimumWaterLevel(tankIndex, 10)            # Sets the minimum water level = 10 to the tanks with index 128 and 129
d.getNodeTankMinimumWaterLevel()
Example 5:

tankIndex = d.getNodeTankIndex()
d.setNodeTankMinimumWaterLevel(tankIndex, [5, 15])       # Sets the minimum water level = 5 and 15 to the tanks with index 128 and 129 respectively
d.getNodeTankMinimumWaterLevel()
See also getNodeTankMinimumWaterLevel, setNodeTankInitialLevel, setNodeTankMaximumWaterLevel, setNodeTankMinimumWaterVolume, setNodeTankMixingFraction, setNodeTankData.

setNodeTankMinimumWaterVolume(value, *argv)[source]
Sets the minimum water volume value for tanks.

The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example 1:

d.getNodeTankMinimumWaterVolume()                           # Retrieves the minimum water volume of all tanks
d.setNodeTankMinimumWaterVolume(1000)                       # Sets the minimum water volume = 1000 to every tank
d.getNodeTankMinimumWaterVolume()
Example 2: (The input array must have a length equal to the number of tanks).

d.setNodeTankMinimumWaterVolume([1500, 2000])               # Sets the minimum water volume = 1500 and 2000 to the 2 tanks
d.getNodeTankMinimumWaterVolume()
Example 3:

d.setNodeTankMinimumWaterVolume(1, 1000)                    # Sets the minimum water volume = 1000 to the 1st tank
d.getNodeTankMinimumWaterVolume()
Example 4:

tankIndex = d.getNodeTankIndex()
d.setNodeTankMinimumWaterVolume(tankIndex, 1500)            # Sets the minimum water volume = 1500 to the tanks with index 128 and 129
d.getNodeTankMinimumWaterVolume()
Example 5:

tankIndex = d.getNodeTankIndex()
d.setNodeTankMinimumWaterVolume(tankIndex, [1000, 2000])     # Sets the minimum water volume = 1000 and 2000 to the tanks with index 128 and 129 respectively
d.getNodeTankMinimumWaterVolume()
See also getNodeTankMinimumWaterVolume, setNodeTankInitialLevel, setNodeTankMinimumWaterLevel, setNodeTankMaximumWaterLevel, setNodeTankMixingFraction, setNodeTankData.

setNodeTankMixingFraction(value, *argv)[source]
Sets the tank mixing fraction of total volume occupied by the inlet/outlet zone in a 2-compartment tank.

The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example 1:

d.getNodeTankMixingFraction()                     # Retrieves the mixing fraction of all tanks
d.setNodeTankMixingFraction(0)                    # Sets the mixing fraction = 0 to every tank
d.getNodeTankMixingFraction()
Example 2: (The input array must have a length equal to the number of tanks).

d.setNodeTankMixingFraction([1, 0])               # Sets the mixing fraction = 1 and 0 to the 2 tanks
d.getNodeTankMixingFraction()
Example 3:

d.setNodeTankMixingFraction(1, 0)                 # Sets the mixing fraction = 0 to the 1st tank
d.getNodeTankMixingFraction()
Example 4:

tankIndex = d.getNodeTankIndex()
d.setNodeTankMixingFraction(tankIndex, 1)         # Sets the mixing fraction = 1 to the tanks with index 128 and 129
d.getNodeTankMixingFraction()
Example 5:

tankIndex = d.getNodeTankIndex()
d.setNodeTankMixingFraction(tankIndex, [1, 0])     # Sets the mixing fraction = 1 and 0 to the tanks with index 128 and 129 respectively
d.getNodeTankMixingFraction()
See also getNodeTankMixingFraction, setNodeTankMixingModelType, setNodeTankMinimumWaterLevel, setNodeTankMinimumWaterVolume, setNodeTankDiameter, setNodeTankData.

setNodeTankMixingModelType(value, *argv)[source]
Sets the mixing model type value for tanks.

The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example 1:

d.getNodeTankMixingModelType()                                 # Retrieves the  mixing model type of all tanks
d.setNodeTankMixingModelType('MIX2')                           # Sets the  mixing model type = 'MIX2' to every tank
d.getNodeTankMixingModelType()
Example 2: (The input array must have a length equal to the number of tanks)

d.setNodeTankMixingModelType(['MIX1', 'LIFO'])                 # Sets the  mixing model type = 'MIX1' and 'LIFO' to the 2 tanks
d.getNodeTankMixingModelType()
Example 3:

d.setNodeTankMixingModelType(1, 'FIFO')                        # Sets the  mixing model type = 'FIFO' to the 1st tank
d.getNodeTankMixingModelType()
Example 4:

tankIndex = d.getNodeTankIndex()
d.setNodeTankMixingModelType(tankIndex, 'MIX1')                # Sets the  mixing model type = 'MIX1' to the tanks with index 128 and 129
d.getNodeTankMixingModelType()
Example 5:

tankIndex = d.getNodeTankIndex()
d.setNodeTankMixingModelType(tankIndex, ['MIX2', 'LIFO'])      # Sets the  mixing model type = 'MIX2' and 'LIFO' to the tanks with index 128 and 129 respectively
d.getNodeTankMixingModelType()
See also getNodeTankMixingModelType, setNodeTankBulkReactionCoeff, setNodeTankMixingFraction, setNodeTankMinimumWaterVolume, setNodeTankMinimumWaterLevel, setNodeTankData.

setNodeTypeJunction(Id)[source]
Transforms a node to JUNCTION The new node keeps the id,coordinates and elevation of the deleted one

Example 1:

d = epanet('Net1.inp')
index = d.setNodeTypeJunction('2')
d.getNodeType(index)
d.plot()
setNodeTypeReservoir(Id)[source]
Transforms a node to RESERVOIR The new node keeps the id,coordinates and elevation of the deleted one

Example 1:

d = epanet('Net1.inp')
index = d.setNodeTypeReservoir('13')
d.getNodeType(index)
d.plot()
setNodeTypeTank(Id)[source]
Transforms a node to TANK The new node keeps the id,coordinates and elevation of the deleted one

Example 1:

d = epanet('Net1.inp')
index = d.setNodeTypeTank('13')
d.getNodeType(index)
d.plot()
setNodesConnectingLinksID(linkIndex, startNodeID, endNodeID)[source]
Sets the IDs of a link’s start- and end-nodes.

Example 1:

d.getNodesConnectingLinksID()  # Retrieves the ids of the from/to nodes of all links
linkIndex = 2
startNodeID = '11'
endNodeID = '22'
d.setNodesConnectingLinksID(linkIndex, startNodeID, endNodeID)
d.getNodesConnectingLinksID()
Example 2:

linkIndex   = [2, 3]
startNodeID = ['12', '13']
endNodeID   = ['21', '22']
d.setNodesConnectingLinksID(linkIndex, startNodeID, endNodeID)
d.getNodesConnectingLinksID()
d.plot()
See also getLinkNodesIndex, getNodesConnectingLinksID, setLinkLength, setLinkNameID, setLinkComment.

setOptionsAccuracyValue(value)[source]
Sets the total normalized flow change for hydraulic convergence.

Example:

d.setOptionsAccuracyValue(0.001)
d.getOptionsAccuracyValue()
See also getOptionsAccuracyValue, setOptionsExtraTrials, setOptionsMaxTrials.

setOptionsCheckFrequency(value)[source]
Sets the frequency of hydraulic status checks.

Example:

d.setOptionsCheckFrequency(2)
d.getOptionsCheckFrequency()
See also getOptionsCheckFrequency, setOptionsMaxTrials, setOptionsMaximumCheck.

setOptionsDampLimit(value)[source]
Sets the accuracy level where solution damping begins.

Example:

d.setOptionsDampLimit(0)
d.getOptionsDampLimit()
See also getOptionsDampLimit, setOptionsMaxTrials, setOptionsCheckFrequency.

setOptionsDemandCharge(value)[source]
Sets the energy charge per maximum KW usage.

Example:

d.setOptionsDemandCharge(0)
d.getOptionsDemandCharge()
See also getOptionsDemandCharge, setOptionsGlobalPrice, setOptionsGlobalPattern.

setOptionsEmitterExponent(value)[source]
Sets the power exponent for the emmitters.

Example:

d.setOptionsEmitterExponent(0.5)
d.getOptionsEmitterExponent()
See also getOptionsEmitterExponent, setOptionsPatternDemandMultiplier, setOptionsAccuracyValue.

setOptionsExtraTrials(value)[source]
Sets the extra trials allowed if hydraulics don’t converge.

Example:

d.setOptionsExtraTrials(10)
d.getOptionsExtraTrials()
# Set UNBALANCED to STOP
d.setOptionsExtraTrials(-1)
See also getOptionsExtraTrials, setOptionsMaxTrials, setOptionsMaximumCheck.

setOptionsFlowChange(value)[source]
Sets the maximum flow change for hydraulic convergence.

Example:

d.setOptionsFlowChange(0)
d.getOptionsFlowChange()
See also getOptionsFlowChange, setOptionsHeadError, setOptionsHeadLossFormula.

setOptionsGlobalEffic(value)[source]
Sets the global efficiency for pumps(percent).

Example:

d.setOptionsGlobalEffic(75)
d.getOptionsGlobalEffic()
See also getOptionsGlobalEffic, setOptionsGlobalPrice, setOptionsGlobalPattern.

setOptionsGlobalPattern(value)[source]
Sets the global energy price pattern.

Example:

d.setOptionsGlobalPattern(1)
d.getOptionsGlobalPattern()
See also getOptionsGlobalPattern, setOptionsGlobalEffic, setOptionsGlobalPrice.

setOptionsGlobalPrice(value)[source]
Sets the global average energy price per kW-Hour.

Example:

d.setOptionsGlobalPrice(0)
d.getOptionsGlobalPrice()
See also getOptionsGlobalPrice, setOptionsGlobalEffic, setOptionsGlobalPattern.

setOptionsHeadError(value)[source]
Sets the maximum head loss error for hydraulic convergence.

Example:

d.setOptionsHeadError(0)
d.getOptionsHeadError()
See also getOptionsHeadError, setOptionsEmitterExponent, setOptionsAccuracyValue.

setOptionsHeadLossFormula(value)[source]
Sets the headloss formula. ‘HW’ = 0, ‘DW’ = 1, ‘CM’ = 2

Example:

d.setOptionsHeadLossFormula('HW')    # Sets the 'HW' headloss formula
d.getOptionsHeadLossFormula()
See also getOptionsHeadLossFormula, setOptionsHeadError, setOptionsFlowChange.

setOptionsLimitingConcentration(value)[source]
Sets the limiting concentration for growth reactions.

Example:

d.setOptionsLimitingConcentration(0)
d.getOptionsLimitingConcentration()
See also getOptionsLimitingConcentration, setOptionsPipeBulkReactionOrder, setOptionsPipeWal

setOptionsMaxTrials(value)[source]
Sets the maximum hydraulic trials allowed for hydraulic convergence.

Example:

d.setOptionsMaxTrials(40)
d.getOptionsMaxTrials()
See also getOptionsMaxTrials, setOptionsExtraTrials, setOptionsAccuracyValue.

setOptionsMaximumCheck(value)[source]
Sets the maximum trials for status checking.

Example:

d.setOptionsMaximumCheck(10)
d.getOptionsMaximumCheck()
See also getOptionsMaximumCheck, setOptionsMaxTrials, setOptionsCheckFrequency.

setOptionsPatternDemandMultiplier(value)[source]
Sets the global pattern demand multiplier.

Example:

d.setOptionsPatternDemandMultiplier(1)
d.getOptionsPatternDemandMultiplier()
See also getOptionsPatternDemandMultiplier, setOptionsEmitterExponent, setOptionsAccuracyValue.

setOptionsPipeBulkReactionOrder(value)[source]
Sets the bulk water reaction order for pipes.

Example:

d.setOptionsPipeBulkReactionOrder(1)
d.getOptionsPipeBulkReactionOrder()
See also getOptionsPipeBulkReactionOrder, setOptionsPipeWallReactionOrder, setOptionsTankBulkReactionOrder.

setOptionsPipeWallReactionOrder(value)[source]
Sets the wall reaction order for pipes (either 0 or 1).

Example:

d.setOptionsPipeWallReactionOrder(1)
d.getOptionsPipeWallReactionOrder()
See also getOptionsPipeWallReactionOrder, setOptionsPipeBulkReactionOrder, setOptionsTankBulkReactionOrder.

setOptionsQualityTolerance(value)[source]
Sets the water quality analysis tolerance.

Example:

d.setOptionsQualityTolerance(0.01)
d.getOptionsQualityTolerance()
See also getOptionsQualityTolerance, setOptionsSpecificDiffusivity, setOptionsLimitingConcentration.

setOptionsSpecificDiffusivity(value)[source]
Sets the specific diffusivity (relative to chlorine at 20 deg C).

Example:

d.setOptionsSpecificDiffusivity(1)
d.getOptionsSpecificDiffusivity()
See also getOptionsSpecificDiffusivity, setOptionsSpecificViscosity, setOptionsSpecificGravity.

setOptionsSpecificGravity(value)[source]
Sets the specific gravity.

Example:

d.setOptionsSpecificGravity(1)
d.getOptionsSpecificGravity()
See also getOptionsSpecificGravity, setOptionsSpecificViscosity, setOptionsHeadLossFormula.

setOptionsSpecificViscosity(value)[source]
Sets the specific viscosity.

Example:

d.setOptionsSpecificViscosity(1)
d.getOptionsSpecificViscosity()
See also getOptionsSpecificViscosity, setOptionsSpecificGravity, setOptionsHeadLossFormula.

setOptionsTankBulkReactionOrder(value)[source]
Sets the bulk water reaction order for tanks.

Example:

d.setOptionsTankBulkReactionOrder(1)
d.getOptionsTankBulkReactionOrder()
See also getOptionsTankBulkReactionOrder, setOptionsPipeBulkReactionOrder, setOptionsPipeWallReactionOrder.

setPattern(index, patternVector)[source]
Sets all of the multiplier factors for a specific time pattern.

Example:

patternID = 'new_pattern'
patternIndex = d.addPattern(patternID)     # Adds a new time pattern
patternMult = [1.56, 1.36, 1.17, 1.13, 1.08,
   1.04, 1.2, 0.64, 1.08, 0.53, 0.29, 0.9, 1.11,
   1.06, 1.00, 1.65, 0.55, 0.74, 0.64, 0.46,
   0.58, 0.64, 0.71, 0.66]
d.setPattern(patternIndex, patternMult)    # Sets the multiplier factors for the new time pattern
d.getPattern()                             # Retrieves the multiplier factor for all patterns and all times
See also getPattern, setPatternValue, setPatternMatrix, setPatternNameID, addPattern, deletePattern.

setPatternComment(value, *argv)[source]
Sets the comment string assigned to the pattern object.

Example 1:

patternIndex = 1
patternComment = 'This is a PATTERN'
d.setPatternComment(patternIndex, patternComment)   # Sets the comment of the 1st pattern
d.getPatternComment(patternIndex)                   # Retrieves the comment of the 1st pattern
Example 2:

patternIndex = [1,2]
patternComment = ['1st PATTERN', '2nd PATTERN']
d.setPatternComment(patternIndex, patternComment)   # Sets the comments of the first 2 patterns (if exist)
d.getPatternComment(patternIndex)
Example 3:

d = epanet('BWSN_Network_1.inp')
patternComment = ['1st PAT', '2nd PAT', '3rd PAT', "4rth PAT"]
d.setPatternComment(patternComment)                 # Sets the comments of all the patterns (the length of the list
                                                          must be equal to the number of patterns)
d.getPatternComment()
See also getPatternComment, setPatternNameID, setPattern.

setPatternMatrix(patternMatrix)[source]
Sets all of the multiplier factors for all time patterns.

Example:

patternID_1 = 'new_pattern_1'
patternIndex_1 = d.addPattern(patternID_1)    # Adds a new time pattern
patternID_2 = 'new_pattern_2'
patternIndex_2 = d.addPattern(patternID_2)    # Adds a new time pattern
patternMult = d.getPattern()
patternMult[patternIndex_1-1, 1] = 5            # The 2nd multiplier = 5 of the 1st time pattern
patternMult[patternIndex_2-1, 2] = 7            # The 3rd multiplier = 7 of the 2nd time pattern
d.setPatternMatrix(patternMult)               # Sets all of the multiplier factors for all the time patterns given a matrix
d.getPattern()                                # Retrieves the multiplier factor for all patterns and all times
See also getPattern, setPattern, setPatternValue, setPatternNameID, addPattern, deletePattern.

setPatternNameID(index, Id)[source]
Sets the name ID of a time pattern given it’s index and the new ID.

Example 1:

d.getPatternNameID()                                   # Retrieves the name IDs of all the time patterns
d.setPatternNameID(1, 'Pattern1')                      # Sets to the 1st time pattern the new name ID 'Pattern1'
d.getPatternNameID()
Example 2:

d.setPatternNameID([1, 2], ['Pattern1', 'Pattern2'])   # Sets to the 1st and 2nd time pattern the new name IDs 'Pattern1' and 'Pattern2' respectively
d.getPatternNameID()
See also getPatternNameID, getPatternIndex, getPatternLengths, setPatternComment, setPattern.

setPatternValue(index, patternTimeStep, patternFactor)[source]
Sets the multiplier factor for a specific period within a time pattern.

Example:

patternID = 'new_pattern'
patternIndex = d.addPattern(patternID)                          # Adds a new time pattern
patternTimeStep = 2
patternFactor = 5
d.setPatternValue(patternIndex, patternTimeStep, patternFactor) # Sets the multiplier factor = 5 to the 2nd time period of the new time pattern
d.getPattern()                                                    # Retrieves the multiplier factor for all patterns and all times
See also getPattern, setPattern, setPatternMatrix, setPatternNameID, addPattern, deletePattern.

setQualityType(*argv)[source]
Sets the type of water quality analysis called for.

Example 1:

d.setQualityType('none')                         # Sets no quality analysis.
qualInfo = d.getQualityInfo()                      # Retrieves quality analysis information
Example 2:

d.setQualityType('age')                          # Sets water age analysis
qualInfo = d.getQualityInfo()
Example 3:

d.setQualityType('chem', 'Chlorine')             # Sets chemical analysis given the name of the chemical being analyzed
qualInfo = d.getQualityInfo()
d.setQualityType('chem', 'Chlorine', 'mg/Kg')    # Sets chemical analysis given the name of the chemical being analyzed and units that the chemical is measured in
qualInfo = d.getQualityInfo()
Example 4:

nodeID = d.getNodeNameID(1)
d.setQualityType('trace', nodeID)                # Sets source tracing analysis given the ID label of node traced in a source tracing analysis
qualInfo = d.getQualityInfo()
See also getQualityInfo, getQualityType, getQualityCode, getQualityTraceNodeIndex.

setReport(value)[source]
Issues a report formatting command. Formatting commands are the same as used in the [REPORT] section of the EPANET Input file. More: https://github.com/OpenWaterAnalytics/EPANET/wiki/%5BREPORT%5D

Example 1:

d.setReport('FILE TestReport.txt')
Example 2:

d.setReport('STATUS YES')
See also setReportFormatReset, setReport.

setReportFormatReset()[source]
Resets a project’s report options to their default values.

Example:

d.setReportFormatReset()
See also setReport, setReportStatus.

setReportStatus(value)[source]
Sets the level of hydraulic status reporting.

Possible status that can be set:
‘yes’

‘no’

‘full’

Example:

d.setReportStatus('full')
See also setReport, setReportFormatReset.

setRuleElseAction(ruleIndex, actionIndex, else_action)[source]
Sets rule - based control else actions.

Input Arguments:
Rule Index

Action Index

Link Index

Type

Value

Where Type = ‘STATUS’ or ‘SETTING’ and Value = the value of STATUS/SETTING

See more: ‘https://nepis.epa.gov/Adobe/PDF/P1007WWU.pdf’ (Page 164)

The example is based on d = epanet(‘Net1.inp’)

Example:

d.addRules("RULE RULE-1 
IF TANK 2 LEVEL >= 140 THEN PIPE 10 STATUS IS CLOSED ELSE PIPE 10 STATUS IS OPEN PRIORITY 1”) # Adds a new rule - based control

rule = d.getRules(1)   # Retrieves the 1st rule - based control
ruleIndex = 1
actionIndex = 1
else_action = 'ELSE PIPE 11 STATUS IS CLOSED'
d.setRuleElseAction(ruleIndex, actionIndex, else_action)   # Sets the new else - action in the 1st rule - based control, in the 1st else - action.
rule = d.getRules(1)
See also setRules, setRuleThenAction, setRulePriority, getRuleInfo, getRules, addRules, deleteRules.

setRulePremise(ruleIndex, premiseIndex, premise)[source]
Sets the premise of a rule - based control.

The examples are based on d = epanet(‘BWSN_Network_1.inp’)

Example 1:

d.getRules()[1]['Premises']                          # Retrieves the premise of the 1st rule
ruleIndex = 1
premiseIndex = 1
premise = 'IF SYSTEM CLOCKTIME >= 8 PM'
d.setRulePremise(ruleIndex, premiseIndex, premise)   # Sets the 1st premise of the 1st rule - based control
d.getRules()[1]['Premises']
Example 2:

d.getRules()[1]['Premises']
ruleIndex = 1
premiseIndex = 1
premise = 'IF NODE TANK-131 LEVEL > 20'
d.setRulePremise(ruleIndex, premiseIndex, premise)   # Sets the 1st premise of the 1st rule - based control
d.getRules()[1]['Premises']
See also setRulePremiseObjectNameID, setRulePremiseStatus, setRulePremiseValue, setRules, getRules, addRules, deleteRules.

setRulePremiseObjectNameID(ruleIndex, premiseIndex, objNameID)[source]
Sets the ID of an object in a premise of a rule-based control.

# The example is based on d = epanet(‘BWSN_Network_1.inp’)

Example: Sets the node’s ID = ‘TANK-131’ to the 1st premise of the 1st rule - based control.

d.getRules()[1]['Premises']
ruleIndex = 1
premiseIndex = 1
objNameID = 'TANK-131'
d.setRulePremiseObjectNameID(ruleIndex, premiseIndex, objNameID)
d.getRules()[1]['Premises']
See also setRulePremise, setRulePremiseStatus, setRulePremiseValue, setRules, getRules, addRules, deleteRules.

setRulePremiseStatus(ruleIndex, premiseIndex, status)[source]
Sets the status being compared to in a premise of a rule-based control.

The example is based on d = epanet(‘Net1.inp’)

Example:

d.getRules()
d.addRules('RULE RULE-1 
IF LINK 110 STATUS = CLOSED THEN PUMP 9 STATUS IS CLOSED PRIORITY 1’)

d.getRules(1)
ruleIndex = 1
premiseIndex = 1
status = 'OPEN'
d.setRulePremiseStatus(ruleIndex, premiseIndex, status)   # Sets the status = 'OPEN' to the 1st premise of the 1st rule - based control
d.getRules()[1]['Premises']
See also setRulePremise, setRulePremiseObjectNameID, setRulePremiseValue, setRules, getRules, addRules, deleteRules.

setRulePremiseValue(ruleIndex, premiseIndex, value)[source]
Sets the value being compared to in a premise of a rule-based control.

The example is based on d = epanet(‘BWSN_Network_1.inp’)

Example:

d.getRules()[1]['Premises']
ruleIndex = 1
premiseIndex = 1
value = 20
d.setRulePremiseValue(ruleIndex, premiseIndex, value)   # Sets the value = 20 to the 1st premise of the 1st rule - based control
d.getRules()[1]['Premises']
See also setRulePremise, setRulePremiseObjectNameID, setRulePremiseStatus, setRules, getRules, addRules, deleteRules.

setRulePriority(ruleIndex, priority)[source]
Sets rule - based control priority.

The example is based on d = epanet(‘BWSN_Network_1.inp’)

Example:

d.getRules()[1]['Rule']                  # Retrieves the 1st rule - based control
ruleIndex = 1
priority = 2
d.setRulePriority(ruleIndex, priority)   # Sets the 1st rule - based control priority = 2
d.getRules()[1]['Rule']
See also setRules, setRuleThenAction, setRuleElseAction, getRuleInfo, getRules, addRules, deleteRules.

setRuleThenAction(ruleIndex, actionIndex, then_action)[source]
Sets rule - based control then actions.

Input Arguments:
Rule Index

Action Index

Then clause

See more: ‘https://nepis.epa.gov/Adobe/PDF/P1007WWU.pdf’ (Page 164)

The example is based on d = epanet(‘Net1.inp’)

Example:

d.addRules('RULE RULE-1 
IF TANK 2 LEVEL >= 140 THEN PIPE 10 STATUS IS CLOSED ELSE PIPE 10 STATUS IS OPEN PRIORITY 1’) # Adds a new rule - based control

rule = d.getRules(1)   # Retrieves the 1st rule - based control
ruleIndex = 1
actionIndex = 1
then_action = 'THEN PIPE 11 STATUS IS OPEN'
d.setRuleThenAction(ruleIndex, actionIndex, then_action)
rule = d.getRules(1)
See also setRules, setRuleElseAction, setRulePriority, getRuleInfo, getRules, addRules, deleteRules.

setRules(ruleIndex, rule)[source]
Sets a rule - based control.

The example is based on d = epanet(‘Net1.inp’)

Example:

rule = 'RULE RULE-1 
IF NODE 2 LEVEL >= 140 THEN PIPE 10 STATUS IS CLOSED ELSE PIPE 10 STATUS IS OPEN PRIORITY 1’

d.addRules(rule)              # Adds a new rule - based control
d.getRules()[1]['Rule']       # Retrieves the 1st rule - based control
ruleIndex = 1
rule_new = 'IF NODE 2 LEVEL > 150 
THEN PIPE 10 STATUS IS OPEN ELSE PIPE 11 STATUS IS OPEN PRIORITY 2’

d.setRules(ruleIndex, rule_new)   # Sets rule - based control
d.getRules()[1]['Rule']
See also setRulePremise, setRuleThenAction, setRuleElseAction, getRules, addRules, deleteRules.

setTimeHydraulicStep(value)[source]
Sets the hydraulic time step.

Example:

Hstep = 1800
d.setTimeHydraulicStep(Hstep)
d.getTimeHydraulicStep()
See also getTimeSimulationDuration, setTimeQualityStep, setTimePatternStep.

setTimePatternStart(value)[source]
Sets the time when time patterns begin.

Example:

patternStart = 0
d.setTimePatternStart(patternStart)
d.getTimePatternStart()
See also getTimePatternStart, setTimePatternStep, setTimeHydraulicStep.

setTimePatternStep(value)[source]
Sets the time pattern step.

Example:

patternStep = 3600
d.setTimePatternStep(patternStep)
d.getTimePatternStep()
See also getTimePatternStep, setTimePatternStart, setTimeHydraulicStep.

setTimeQualityStep(value)[source]
Sets the quality time step.

Example:

Qstep = 1800
d.setTimeQualityStep(Qstep)
d.getTimeQualityStep()
See also getTimeQualityStep, setTimeHydraulicStep, setTimePatternStep.

setTimeReportingStart(value)[source]
Sets the time when reporting starts.

Example:

reportingStart = 0
d.setTimeReportingStart(reportingStart)
d.getTimeReportingStart()
See also getTimeReportingStart, setTimeReportingStep, setTimePatternStart.

setTimeReportingStep(value)[source]
Sets the reporting time step.

Example:

reportingStep = 3600
d.setTimeReportingStep(reportingStep)
d.getTimeReportingStep()
See also getTimeReportingStep(), setTimeReportingStart, setTimeRuleControlStep.

setTimeRuleControlStep(value)[source]
Sets the rule-based control evaluation time step.

Example:

ruleControlStep = 360
d.setTimeRuleControlStep(ruleControlStep)
d.getTimeRuleControlStep()
See also getTimeRuleControlStep, setTimeReportingStep, setTimePatternStep.

setTimeSimulationDuration(value)[source]
Sets the simulation duration (in seconds).

Example:

simulationDuration = 172800    # 172800 seconds = 2days
d.setTimeSimulationDuration(simulationDuration)
d.getTimeSimulationDuration()
See also getTimeSimulationDuration(), getTimeStartTime(), getTimeHaltFlag().

setTimeStatisticsType(value)[source]
Sets the statistic type.

Types that can be set:
‘NONE’

‘AVERAGE’

‘MINIMUM’

‘MAXIMUM’

‘RANGE’

Example:

d.getTimeStatisticsType()
statisticsType = 'AVERAGE'
d.setTimeStatisticsType(statisticsType)
d.getTimeStatisticsType()
See also getTimeStatisticsType, setTimeReportingStart, setTimeReportingStep.

setTitle(*argv)[source]
Sets the title lines of the project.

Example:

line_1 = 'This is a title'
line_2 = 'This is a test line 2'
line_3 = 'This is a test line 3'
d.setTitle(line_1, line_2, line_3)
[Line1, Line2, Line3] = d.getTitle()
See also getTitle, setLinkComment, setNodeComment.

solveCompleteHydraulics()[source]
Runs a complete hydraulic simulation with results for all time periods written to the binary Hydraulics file.

Example:

d.solveCompleteHydraulics()
See also solveCompleteQuality.

solveCompleteQuality()[source]
Runs a complete water quality simulation with results at uniform reporting intervals written to EPANET’s binary Output file.

Example:

d.solveCompleteQuality()
See also solveCompleteHydraulics.

solveMSXCompleteHydraulics()[source]
Solve complete hydraulic over the entire simulation period. % % Example: % d = epanet(‘net2-cl2.inp’) % d.loadMSXFile(‘net2-cl2.msx’) % d.solveMSXCompleteHydraulics() % % See also solveMSXCompleteQuality.

solveMSXCompleteQuality()[source]
Solve complete hydraulic over the entire simulation period.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) d.solveMSXCompleteQuality()

See also solveMSXCompleteHydraulics.

splitPipe(pipeID, newPipeID, newNodeID)[source]
Splits a pipe (pipeID), creating two new pipes (pipeID and newPipeID) and adds a junction/node (newNodeID) in between. If the pipe is linear the pipe is splitted in half, otherwisw the middle point of the vertice array elemnts is taken as the split point. The two new pipes have the same properties as the one which is splitted. The new node’s properties are the same with the nodes on the left and right and New Node Elevation and Initial quality is the average of the two.

Example 1: Splits pipe with ID ‘11’ to pipes ‘11’ and ‘11a’ and creates the node ‘11a’ in the link of the two new pipes.

d = epanet('Net1.inp')
pipeID = '11'
newPipeID = '11a'
newNodeID = '11node'
[leftPipeIndex, rightPipeIndex] = d.splitPipe(pipeID,newPipeID,newNodeID)
d.getLinkIndex()
d.getNodesConnectingLinksID()
d.plot('highlightlink', pipeID)
Example 2: Splits pipe with ID ‘P-837’ to pipes ‘P-837’ and ‘P-837a’ and creates the node ‘P-837node’ in the link of the two new pipes, using vertices. (The new left pipe can be noticed at the top left of the plot in red colour)

d = epanet('ky10.inp')
pipeID = 'P-837'
newPipeID= 'P-837a'
newNodeID= 'P-837node'
[leftPipeIndex, rightPipeIndex] = d.splitPipe(pipeID,newPipeID,newNodeID)
d.plot('highlightlink', pipeID)
stepMSXQualityAnalysisTimeLeft()[source]
Advances the water quality solution through a single water quality time step when
performing a step-wise simulation.

Example:
d = epanet(‘net2-cl2.inp’) d.loadMSXFile(‘net2-cl2.msx’) tleft = 1 d.solveMSXCompleteHydraulics() d.initializeMSXQualityAnalysis(0) while(tleft>0):

t,tleft = d.stepMSXQualityAnalysisTimeLeft()

% See also solveMSXCompleteHydraulics, initializeMSXQualityAnalysis.

stepQualityAnalysisTimeLeft()[source]
Advances the water quality simulation one water quality time step. The time remaining in the overall simulation is returned in tleft.

Example:

tleft = d.stepQualityAnalysisTimeLeft()
For more, you can type help getNodePressure and check examples 3 & 4.

See also runQualityAnalysis, closeQualityAnalysis.

to_array(list_value)[source]
Transforms a list to numpy.array type

to_mat(list_value)[source]
Transforms a list to numpy.array type

unload()[source]
unload() library and close the EPANET Toolkit system.

Example:

d.unload()
See also epanet, saveInputFile, closeNetwork().

unloadMSX()[source]
Unload library and close the MSX Toolkit system. Example:

d.unloadMSX()

useHydraulicFile(hydname)[source]
Uses the contents of the specified file as the current binary hydraulics file.

Example:

filename = 'test.hyd'
d.useHydraulicFile(filename)
See also saveHydraulicFile, initializeHydraulicAnalysis.

useMSXHydraulicFile(hydname)[source]
% Uses a previously saved EPANET hydraulics file as the source % of hydraulic information. % % Example: % d = epanet(‘net2-cl2.inp’); % d.loadMSXFile(‘net2-cl2.msx’); % d.saveHydraulicsOutputReportingFile % d.saveHydraulicFile(‘testMSXHydraulics.hyd’) % d.useMSXHydraulicFile(‘testMSXHydraulics.hyd’) % % See also saveHydraulicsOutputReportingFile, saveHydraulicFile.

writeLineInReportFile(line)[source]
Writes a line of text to the EPANET report file.

Example:

line = 'Status YES'
d.writeLineInReportFile(line)
See also writeReport, copyReport.

writeMSXFile(msx)[source]
Write a new MSX file
Example for wirteMSXFile:
msx = d.initializeMSXWrite()

msx.FILENAME=”cl34.msx” msx.TITLE = “CL2 Full msx” msx.AREA_UNITS = ‘FT2’ msx.RATE_UNITS = ‘DAY’ msx.SOLVER = ‘EUL’ msx.COUPLING = ‘NONE’ msx.COMPILER = ‘NONE’ msx.TIMESTEP = 300 msx.ATOL = 0.001 msx.RTOL = 0.001

msx.SPECIES={‘BULK CL2 MG 0.01 0.001’} msx.COEFFICIENTS = {‘PARAMETER Kb 0.3’, ‘PARAMETER Kw 1’} msx.TERMS = {‘Kf 1.5826e-4 * RE^0.88 / D’} msx.PIPES = {‘RATE CL2 -Kb*CL2-(4/D)*Kw*Kf/(Kw+Kf)*CL2’} msx.TANKS = {‘RATE CL2 -Kb*CL2’} msx.SOURCES = {‘CONC 1 CL2 0.8 ‘} msx.GLOBAL = {‘Global CL2 0.5’} msx.QUALITY = {‘NODE 26 CL2 0.1’} msx.PARAMETERS = {‘’} msx.PATERNS = {‘’} d.writeMSXFile(msx) d.unloadMSX() d.loadMSXFile(msx.FILENAME) d.unloadMSX() d.unload()

writeMSXReport()[source]
writeReport()[source]
Writes a formatted text report on simulation results to the Report file.

Example:

d = epanet('Net1.inp')
d.solveCompleteHydraulics()
d.solveCompleteQuality()
d.setReportFormatReset()
d.setReport('FILE TestReport3.txt')
d.setReport('NODES ALL')
d.setReport('LINKS ALL')
d.writeReport()
report_file_string = open('TestReport3.txt').read()
See also copyReport, writeLineInReportFile.

classepyt.epanet.epanetapi(version=2.2, ph=False, loadlib=True, customlib=None)[source]
Bases: object

EPANET Toolkit functions - API

EN_MAXID= 32
ENaddcontrol(conttype, lindex, setting, nindex, level)[source]
Adds a new simple control to a project.

ENaddcontrol(ctype, lindex, setting, nindex, level)

Parameters: conttype the type of control to add (see ControlTypes). lindex the index of a link to control (starting from 1). setting control setting applied to the link. nindex index of the node used to control the link (0 for EN_TIMER and EN_TIMEOFDAY controls). level action level (tank level, junction pressure, or time in seconds) that triggers the control.

Returns: cindex index of the new control.

ENaddcurve(cid)[source]
Adds a new data curve to a project.

ENaddcurve(cid)

Parameters: cid The ID name of the curve to be added.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___curves.html

ENadddemand(nodeIndex, baseDemand, demandPattern, demandName)[source]
Appends a new demand to a junction node demands list.

ENadddemand(nodeIndex, baseDemand, demandPattern, demandName)

Parameters: nodeIndex the index of a node (starting from 1). baseDemand the demand’s base value. demandPattern the name of a time pattern used by the demand. demandName the name of the demand’s category.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___demands.html

ENaddlink(linkid, linktype, fromnode, tonode)[source]
Adds a new link to a project.

ENaddlink(linkid, linktype, fromnode, tonode)

Parameters: linkid The ID name of the link to be added. linktype The type of link being added (see EN_LinkType, self.LinkType). fromnode The ID name of the link’s starting node. tonode The ID name of the link’s ending node.

Returns: index the index of the newly added link. OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___links.html

ENaddnode(nodeid, nodetype)[source]
Adds a new node to a project.

ENaddnode(nodeid, nodetype)

Parameters: nodeid the ID name of the node to be added. nodetype the type of node being added (see EN_NodeType).

Returns: index the index of the newly added node. See also EN_NodeProperty, NodeType

ENaddpattern(patid)[source]
Adds a new time pattern to a project.

ENaddpattern(patid)

Parameters: patid the ID name of the pattern to add.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___patterns.html

ENaddrule(rule)[source]
Adds a new rule-based control to a project.

ENaddrule(rule)

Parameters: rule text of the rule following the format used in an EPANET input file.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___rules.html

ENclearreport()[source]
Clears the contents of a project’s report file.

ENclearreport()

ENclose()[source]
Closes a project and frees all of its memory.

ENclose()

See also ENopen

ENcloseH()[source]
Closes the hydraulic solver freeing all of its allocated memory.

ENcloseH()

See also ENinitH, ENrunH, ENnextH

ENcloseQ()[source]
Closes the water quality solver, freeing all of its allocated memory.

ENcloseQ()

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___quality.html

ENcopyreport(filename)[source]
Copies the current contents of a project’s report file to another file.

ENcopyreport(filename)

Parameters: filename the full path name of the destination file

ENcreateproject()[source]
Copies the current contents of a project’s report file to another file. * ENcreateproject must be called before any other API functions are used. * ENcreateproject()

Parameters: ph an EPANET project handle that is passed into all other API functions.

ENdeletecontrol(index)[source]
Deletes an existing simple control.

ENdeletecontrol(index)

Parameters: index the index of the control to delete (starting from 1).

ENdeletecurve(indexCurve)[source]
Deletes a data curve from a project.

ENdeletecurve(indexCurve)

Parameters: indexCurve The ID name of the curve to be added.

ENdeletedemand(nodeIndex, demandIndex)[source]
Deletes a demand from a junction node.

ENdeletedemand(nodeIndex, demandInde)

Parameters: nodeIndex the index of a node (starting from 1). demandIndex the position of the demand in the node’s demands list (starting from 1).

ENdeletelink(indexLink, condition)[source]
Deletes a link from the project.

ENdeletelink(indexLink, condition)

Parameters: indexLink the index of the link to be deleted. condition The action taken if any control contains the link.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___links.html

ENdeletenode(indexNode, condition)[source]
Deletes a node from a project.

ENdeletenode(indexNode, condition)

Parameters: indexNode the index of the node to be deleted. condition the action taken if any control contains the node and its links.

See also EN_NodeProperty, NodeType OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___nodes.html

ENdeletepattern(indexPat)[source]
Deletes a time pattern from a project.

ENdeletepattern(indexPat)

Parameters: indexPat the time pattern’s index (starting from 1).

ENdeleteproject()[source]
Deletes an EPANET project. * EN_deleteproject should be called after all network analysis has been completed. * ENdeleteproject()

Parameters: ph an EPANET project handle which is returned as NULL.

ENdeleterule(index)[source]
Deletes an existing rule-based control.

ENdeleterule(index)

Parameters: index the index of the rule to be deleted (starting from 1).

ENepanet(inpfile='', rptfile='', binfile='')[source]
Runs a complete EPANET simulation Parameters: inpfile Input file to use rptfile Output file to report to binfile Results file to generate

ENgetaveragepatternvalue(index)[source]
Retrieves the average of all pattern factors in a time pattern.

ENgetaveragepatternvalue(index)

Parameters: index a time pattern index (starting from 1).

Returns: value The average of all of the time pattern’s factors.

ENgetbasedemand(index, numdemands)[source]
Gets the base demand for one of a node’s demand categories. EPANET 20100

ENgetbasedemand(index, numdemands)

Parameters: index a node’s index (starting from 1). numdemands the index of a demand category for the node (starting from 1).

Returns: value the category’s base demand.

ENgetcomment(object_, index)[source]
Retrieves the comment of a specific index of a type object.

ENgetcomment(object, index, comment)

Parameters: object_ a type of object (either EN_NODE, EN_LINK, EN_TIMEPAT or EN_CURVE)

e.g, self.ToolkitConstants.EN_NODE

index object’s index (starting from 1).

Returns: out_comment the comment string assigned to the object.

ENgetcontrol(cindex)[source]
Retrieves the properties of a simple control.

ENgetcontrol(cindex)

Parameters: cindex the control’s index (starting from 1).

Returns: ctype the type of control (see ControlTypes). lindex the index of the link being controlled. setting the control setting applied to the link. nindex the index of the node used to trigger the control (0 for EN_TIMER and EN_TIMEOFDAY controls). level the action level (tank level, junction pressure, or time in seconds) that triggers the control.

ENgetcoord(index)[source]
Gets the (x,y) coordinates of a node.

ENgetcoord(index)

Parameters: index a node index (starting from 1).

Returns: x the node’s X-coordinate value. y the node’s Y-coordinate value.

ENgetcount(countcode)[source]
Retrieves the number of objects of a given type in a project.

ENgetcount(countcode)

Parameters: countcode number of objects of the specified type

Returns: count number of objects of the specified type

ENgetcurve(index)[source]
Retrieves all of a curve’s data.

ENgetcurve(index)

Parameters: index a curve’s index (starting from 1).

out_id the curve’s ID name nPoints the number of data points on the curve. xValues the curve’s x-values. yValues the curve’s y-values.

See also ENgetcurvevalue

ENgetcurveid(index)[source]
Retrieves the ID name of a curve given its index.

ENgetcurveid(index)

Parameters: index a curve’s index (starting from 1).

Returns: Id the curve’s ID name

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___curves.html

ENgetcurveindex(Id)[source]
Retrieves the index of a curve given its ID name.

ENgetcurveindex(Id)

Parameters: Id the ID name of a curve.

Returns: index The curve’s index (starting from 1).

ENgetcurvelen(index)[source]
Retrieves the number of points in a curve.

ENgetcurvelen(index)

Parameters: index a curve’s index (starting from 1).

Returns: len The number of data points assigned to the curve.

ENgetcurvetype(index)[source]
Retrieves a curve’s type.

ENgetcurvetype(index)

Parameters: index a curve’s index (starting from 1).

Returns: type_ The curve’s type (see EN_CurveType).

ENgetcurvevalue(index, period)[source]
Retrieves the value of a single data point for a curve.

ENgetcurvevalue(index, period)

Parameters: index a curve’s index (starting from 1). period the index of a point on the curve (starting from 1).

Returns: x the point’s x-value. y the point’s y-value.

ENgetdemandindex(nodeindex, demandName)[source]
Retrieves the index of a node’s named demand category.

ENgetdemandindex(nodeindex, demandName)

Parameters: nodeindex the index of a node (starting from 1). demandName the name of a demand category for the node.

Returns: demandIndex the index of the demand being sought.

ENgetdemandmodel()[source]
Retrieves the type of demand model in use and its parameters.

ENgetdemandmodel()

Returns: Type Type of demand model (see EN_DemandModel). pmin Pressure below which there is no demand. preq Pressure required to deliver full demand. pexp Pressure exponent in demand function.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___demands.html

ENgetdemandname(node_index, demand_index)[source]
Retrieves the name of a node’s demand category.

ENgetdemandname(node_index, demand_index)

Parameters: node_index a node’s index (starting from 1). demand_index the index of one of the node’s demand categories (starting from 1).

Returns: demand_name The name of the selected category.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___demands.html

ENgetdemandpattern(index, numdemands)[source]
Retrieves the index of a time pattern assigned to one of a node’s demand categories. EPANET 20100 ENgetdemandpattern(index, numdemands)

Parameters: index the node’s index (starting from 1). numdemands the index of a demand category for the node (starting from 1).

Returns: value the index of the category’s time pattern.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___demands.html

ENgetelseaction(ruleIndex, actionIndex)[source]
Gets the properties of an ELSE action in a rule-based control.

ENgetelseaction(ruleIndex, actionIndex)

Parameters: ruleIndex the rule’s index (starting from 1). actionIndex the index of the ELSE action to retrieve (starting from 1).

Returns: linkIndex the index of the link sin the action. status the status assigned to the link (see RULESTATUS). setting the value assigned to the link’s setting.

ENgeterror(errcode=0)[source]
Returns the text of an error message generated by an error code, as warning.

ENgeterror()

ENgetflowunits()[source]
Retrieves a project’s flow units.

ENgetflowunits()

Returns: flowunitsindex a flow units code.

ENgetheadcurveindex(pumpindex)[source]
Retrieves the curve assigned to a pump’s head curve.

ENgetheadcurveindex(pumpindex)

Parameters: pumpindex the index of a pump link (starting from 1).

Returns: value the index of the curve assigned to the pump’s head curve.

ENgetlinkid(index)[source]
Gets the ID name of a link given its index.

ENgetlinkid(index)

Parameters: index a link’s index (starting from 1).

Returns: id The link’s ID name.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___links.html

ENgetlinkindex(Id)[source]
Gets the index of a link given its ID name.

ENgetlinkindex(Id)

Parameters: Id a link’s ID name.

Returns: index the link’s index (starting from 1).

ENgetlinknodes(index)[source]
Gets the indexes of a link’s start- and end-nodes.

ENgetlinknodes(index)

Parameters: index a link’s index (starting from 1).

Returns: from the index of the link’s start node (starting from 1). to the index of the link’s end node (starting from 1).

ENgetlinktype(index)[source]
Retrieves a link’s type.

ENgetlinktype(index)

Parameters: index a link’s index (starting from 1).

Returns: typecode the link’s type (see LinkType).

ENgetlinkvalue(index, paramcode)[source]
Retrieves a property value for a link.

ENgetlinkvalue(index, paramcode)

Parameters: index a link’s index (starting from 1). paramcode the property to retrieve (see EN_LinkProperty).

Returns: value the current value of the property.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___links.html

ENgetnodeid(index)[source]
Gets the ID name of a node given its index

ENgetnodeid(index)

Parameters: index nodes index

Returns: nameID nodes id

ENgetnodeindex(Id)[source]
Gets the index of a node given its ID name.

ENgetnodeindex(Id)

Parameters: Id a node ID name.

Returns: index the node’s index (starting from 1).

ENgetnodetype(index)[source]
Retrieves a node’s type given its index.

ENgetnodetype(index)

Parameters: index a node’s index (starting from 1).

Returns: type the node’s type (see NodeType).

ENgetnodevalue(index, code_p)[source]
Retrieves a property value for a node.

ENgetnodevalue(index, paramcode)

Parameters: index a node’s index. paramcode the property to retrieve (see EN_NodeProperty, self.getToolkitConstants).

Returns: value the current value of the property.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___nodes.html

ENgetnumdemands(index)[source]
Retrieves the number of demand categories for a junction node. EPANET 20100

ENgetnumdemands(index)

Parameters: index the index of a node (starting from 1).

Returns: value the number of demand categories assigned to the node.

ENgetoption(optioncode)[source]
Retrieves the value of an analysis option.

ENgetoption(optioncode)

Parameters: optioncode a type of analysis option (see EN_Option).

Returns: value the current value of the option.

ENgetpatternid(index)[source]
Retrieves the ID name of a time pattern given its index.

ENgetpatternid(index)

Parameters: index a time pattern index (starting from 1).

Returns: id the time pattern’s ID name.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___patterns.html

ENgetpatternindex(Id)[source]
Retrieves the index of a time pattern given its ID name.

ENgetpatternindex(id)

Parameters: id the ID name of a time pattern.

Returns: index the time pattern’s index (starting from 1).

ENgetpatternlen(index)[source]
Retrieves the number of time periods in a time pattern.

ENgetpatternlen(index)

Parameters: index a time pattern index (starting from 1).

Returns: leng the number of time periods in the pattern.

ENgetpatternvalue(index, period)[source]
Retrieves a time pattern’s factor for a given time period.

ENgetpatternvalue(index, period)

Parameters: index a time pattern index (starting from 1). period a time period in the pattern (starting from 1).

Returns: value the pattern factor for the given time period.

ENgetpremise(ruleIndex, premiseIndex)[source]
Gets the properties of a premise in a rule-based control.

ENgetpremise(ruleIndex, premiseIndex)

Parameters: ruleIndex the rule’s index (starting from 1). premiseIndex the position of the premise in the rule’s list of premises (starting from 1).

Returns: logop the premise’s logical operator ( IF = 1, AND = 2, OR = 3 ). object_ the status assigned to the link (see RULEOBJECT). objIndex the index of the object (e.g. the index of a tank). variable the object’s variable being compared (see RULEVARIABLE). relop the premise’s comparison operator (see RULEOPERATOR). status the status that the object’s status is compared to (see RULESTATUS). value the value that the object’s variable is compared to.

ENgetpumptype(index)[source]
Retrieves the type of head curve used by a pump.

ENgetpumptype(pumpindex)

Parameters: pumpindex the index of a pump link (starting from 1).

Returns: value the type of head curve used by the pump (see EN_PumpType).

ENgetqualinfo()[source]
Gets information about the type of water quality analysis requested.

ENgetqualinfo()

Returns: qualType type of analysis to run (see self.QualityType). chemname name of chemical constituent. chemunits concentration units of the constituent. tracenode index of the node being traced (if applicable).

ENgetqualtype()[source]
Retrieves the type of water quality analysis to be run.

ENgetqualtype()

Returns: qualcode type of analysis to run (see self.QualityType). tracenode index of the node being traced (if applicable).

ENgetresultindex(objecttype, index)[source]
Retrieves the order in which a node or link appears in an output file.

ENgetresultindex(objecttype, index)

Parameters: objecttype a type of element (either EN_NODE or EN_LINK). index the element’s current index (starting from 1).

Returns: value the order in which the element’s results were written to file.

ENgetrule(index)[source]
Retrieves summary information about a rule-based control.

ENgetrule(index):

Parameters: index the rule’s index (starting from 1).

Returns: nPremises number of premises in the rule’s IF section. nThenActions number of actions in the rule’s THEN section. nElseActions number of actions in the rule’s ELSE section. priority the rule’s priority value.

ENgetruleID(index)[source]
Gets the ID name of a rule-based control given its index.

ENgetruleID(index)

Parameters: index the rule’s index (starting from 1).

Returns: id the rule’s ID name.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___rules.html

ENgetstatistic(code)[source]
Retrieves a particular simulation statistic. EPANET 20100

ENgetstatistic(code)

Parameters: code the type of statistic to retrieve (see EN_AnalysisStatistic).

Returns: value the value of the statistic.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___reporting.html

ENgetthenaction(ruleIndex, actionIndex)[source]
Gets the properties of a THEN action in a rule-based control.

ENgetthenaction(ruleIndex, actionIndex)

Parameters: ruleIndex the rule’s index (starting from 1). actionIndex the index of the THEN action to retrieve (starting from 1).

Returns: linkIndex the index of the link in the action (starting from 1). status the status assigned to the link (see RULESTATUS). setting the value assigned to the link’s setting.

ENgettimeparam(paramcode)[source]
Retrieves the value of a time parameter.

ENgettimeparam(paramcode)

Parameters: paramcode a time parameter code (see EN_TimeParameter).

Returns: timevalue the current value of the time parameter (in seconds).

ENgettitle()[source]
Retrieves the title lines of the project.

ENgettitle()

Returns: line1 first title line line2 second title line line3 third title line

ENgetversion()[source]
Retrieves the toolkit API version number.

ENgetversion()

Returns: LibEPANET the version of the OWA-EPANET toolkit.

ENgetvertex(index, vertex)[source]
Retrieves the coordinate’s of a vertex point assigned to a link.

ENgetvertex(index, vertex)

Parameters: index a link’s index (starting from 1). vertex a vertex point index (starting from 1).

Returns: x the vertex’s X-coordinate value. y the vertex’s Y-coordinate value.

ENgetvertexcount(index)[source]
Retrieves the number of internal vertex points assigned to a link.

ENgetvertexcount(index)

Parameters: index a link’s index (starting from 1).

Returns: count the number of vertex points that describe the link’s shape.

ENinit(unitsType, headLossType)[source]
Initializes an EPANET project.

ENinit(unitsType, headLossType)

Parameters: unitsType the choice of flow units (see EN_FlowUnits). headLossType the choice of head loss formula (see EN_HeadLossType).

ENinitH(flag)[source]
Initializes a network prior to running a hydraulic analysis.

ENinitH(flag)

Parameters: flag a 2-digit initialization flag (see EN_InitHydOption).

See also ENinitH, ENrunH, ENnextH, ENreport, ENsavehydfile OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___hydraulics.html

ENinitQ(saveflag)[source]
Initializes a network prior to running a water quality analysis.

ENinitQ(saveflag)

Parameters: saveflag set to EN_SAVE (1) if results are to be saved to the project’s

binary output file, or to EN_NOSAVE (0) if not.

See also ENinitQ, ENrunQ, ENnextQ OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___quality.html

ENnextH()[source]
Determines the length of time until the next hydraulic event occurs in an extended period simulation.

ENnextH()

Returns: tstep the time (in seconds) until the next hydraulic event or 0 if at the end of the full simulation duration.

See also ENrunH OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___hydraulics.html

ENnextQ()[source]
Advances a water quality simulation over the time until the next hydraulic event.

ENnextQ()

Returns: tstep time (in seconds) until the next hydraulic event or 0 if at the end of the full simulation duration.

See also ENstepQ, ENrunQ OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___quality.html

ENopen(inpname=None, repname=None, binname=None)[source]
Opens an EPANET input file & reads in network data.

ENopen(inpname, repname, binname)

Parameters: inpname the name of an existing EPANET-formatted input file. repname the name of a report file to be created (or “” if not needed). binname the name of a binary output file to be created (or “” if not needed).

See also ENclose

ENopenH()[source]
Opens a project’s hydraulic solver.

ENopenH()

See also ENinitH, ENrunH, ENnextH, ENcloseH OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___hydraulics.html

ENopenQ()[source]
Opens a project’s water quality solver.

ENopenQ()

See also ENopenQ, ENinitQ, ENrunQ, ENnextQ, ENstepQ, ENcloseQ OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___quality.html

ENreport()[source]
Writes simulation results in a tabular format to a project’s report file.

ENreport()

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___reporting.html

ENresetreport()[source]
Resets a project’s report options to their default values.

ENresetreport()

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___reporting.html

ENrunH()[source]
Computes a hydraulic solution for the current point in time.

ENrunH()

Returns: t the current simulation time in seconds.

See also ENinitH, ENrunH, ENnextH, ENcloseH OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___hydraulics.html

ENrunQ()[source]
Makes hydraulic and water quality results at the start of the current time period available to a project’s water quality solver.

ENrunQ()

Returns: t current simulation time in seconds. See also ENopenQ, ENinitQ, ENrunQ, ENnextQ, ENstepQ OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___quality.html

ENsaveH()[source]
Transfers a project’s hydraulics results from its temporary hydraulics file to its binary output file, where results are only reported at uniform reporting intervals.

ENsaveH()

ENsavehydfile(fname)[source]
Saves a project’s temporary hydraulics file to disk.

ENsaveHydfile(fname)

ENsaveinpfile(inpname)[source]
Saves a project’s data to an EPANET-formatted text file.

ENsaveinpfile(inpname)

ENsetbasedemand(index, demandIdx, value)[source]
Sets the base demand for one of a node’s demand categories.

ENsetbasedemand(index, demandIdx, value)

Parameters: index a node’s index (starting from 1). demandIdx the index of a demand category for the node (starting from 1). value the new base demand for the category.

ENsetcomment(object_, index, comment)[source]
Sets a comment to a specific index

ENsetcomment(object, index, comment)

Parameters: object_ a type of object (either EN_NODE, EN_LINK, EN_TIMEPAT or EN_CURVE)

e.g, obj.ToolkitConstants.EN_NODE

index objects index (starting from 1). comment comment to be added.

ENsetcontrol(cindex, ctype, lindex, setting, nindex, level)[source]
Sets the properties of an existing simple control.

ENsetcontrol(cindex, ctype, lindex, setting, nindex, level)

Parameters: cindex the control’s index (starting from 1). ctype the type of control (see ControlTypes). lindex the index of the link being controlled. setting the control setting applied to the link. nindex the index of the node used to trigger the control (0 for EN_TIMER and EN_TIMEOFDAY controls). level the action level (tank level, junction pressure, or time in seconds) that triggers the control.

ENsetcoord(index, x, y)[source]
Sets the (x,y) coordinates of a node.

ENsetcoord(index, x, y)

Parameters: index a node’s index. x the node’s X-coordinate value. y the node’s Y-coordinate value.

ENsetcurve(index, x, y, nfactors)[source]
Assigns a set of data points to a curve.

ENsetcurve(index, x, y, nfactors)

Parameters: index a curve’s index (starting from 1). x an array of new x-values for the curve. y an array of new y-values for the curve. nfactors the new number of data points for the curve.

See also ENsetcurvevalue OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___curves.html

ENsetcurveid(index, Id)[source]
Changes the ID name of a data curve given its index.

ENsetcurveid(index, Id)

Parameters: index a curve’s index (starting from 1). Id an array of new x-values for the curve.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___curves.html

ENsetcurvevalue(index, pnt, x, y)[source]
Sets the value of a single data point for a curve.

ENsetcurvevalue(index, pnt, x, y)

Parameters: index a curve’s index (starting from 1). pnt the index of a point on the curve (starting from 1). x the point’s new x-value. y the point’s new y-value.

ENsetdemandmodel(Type, pmin, preq, pexp)[source]
Sets the Type of demand model to use and its parameters.

ENsetdemandmodel(index, demandIdx, value)

Parameters: Type Type of demand model (see DEMANDMODEL). pmin Pressure below which there is no demand. preq Pressure required to deliver full demand. pexp Pressure exponent in demand function.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___demands.html

ENsetdemandname(node_index, demand_index, demand_name)[source]
Assigns a name to a node’s demand category.

ENsetdemandname(node_index, demand_index, demand_name) Parameters: node_index a node’s index (starting from 1). demand_index the index of one of the node’s demand categories (starting from 1). demand_name the new name assigned to the category.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___demands.html

ENsetdemandpattern(index, demandIdx, patInd)[source]
Sets the index of a time pattern used for one of a node’s demand categories.

ENsetdemandpattern(index, demandIdx, patInd)

Parameters: index a node’s index (starting from 1). demandIdx the index of one of the node’s demand categories (starting from 1). patInd the index of the time pattern assigned to the category.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___demands.html

ENsetelseaction(ruleIndex, actionIndex, linkIndex, status, setting)[source]
Sets the properties of an ELSE action in a rule-based control.

ENsetelseaction(ruleIndex, actionIndex, linkIndex, status, setting)

Parameters: ruleIndex the rule’s index (starting from 1). actionIndex the index of the ELSE action being modified (starting from 1). linkIndex the index of the link in the action (starting from 1). status the new status assigned to the link (see RULESTATUS). setting the new value assigned to the link’s setting.

ENsetflowunits(code)[source]
Sets a project’s flow units.

ENsetflowunits(code)

Parameters: code a flow units code (see EN_FlowUnits)

ENsetheadcurveindex(pumpindex, curveindex)[source]
Assigns a curve to a pump’s head curve.

ENsetheadcurveindex(pumpindex, curveindex)

Parameters: pumpindex the index of a pump link (starting from 1). curveindex the index of a curve to be assigned as the pump’s head curve.

ENsetjuncdata(index, elev, dmnd, dmndpat)[source]
Sets a group of properties for a junction node.

ENsetjuncdata(index, elev, dmnd, dmndpat)

Parameters: index a junction node’s index (starting from 1). elev the value of the junction’s elevation. dmnd the value of the junction’s primary base demand. dmndpat the ID name of the demand’s time pattern (”” for no pattern).

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___nodes.html

ENsetlinkid(index, newid)[source]
Changes the ID name of a link.

ENsetlinkid(index, newid)

Parameters: index a link’s index (starting from 1). newid the new ID name for the link.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___links.html

ENsetlinknodes(index, startnode, endnode)[source]
Sets the indexes of a link’s start- and end-nodes.

ENsetlinknodes(index, startnode, endnode)

Parameters: index a link’s index (starting from 1). startnode The index of the link’s start node (starting from 1). endnode The index of the link’s end node (starting from 1).

ENsetlinktype(indexLink, paramcode, actionCode)[source]
Changes a link’s type.

ENsetlinktype(id, paramcode, actionCode)

Parameters: indexLink a link’s index (starting from 1). paramcode the new type to change the link to (see self.LinkType). actionCode the action taken if any controls contain the link.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___links.html

ENsetlinkvalue(index, paramcode, value)[source]
Sets a property value for a link.

ENsetlinkvalue(index, paramcode, value)

Parameters: index a link’s index. paramcode the property to set (see EN_LinkProperty). value the new value for the property.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___links.html

ENsetnodeid(index, newid)[source]
Changes the ID name of a node.

ENsetnodeid(index, newid)

Parameters: index a node’s index (starting from 1). newid the new ID name for the node.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___nodes.html

ENsetnodevalue(index, paramcode, value)[source]
Sets a property value for a node.

ENsetnodevalue(index, paramcode, value)

Parameters: index a node’s index (starting from 1). paramcode the property to set (see EN_NodeProperty, self.getToolkitConstants). value the new value for the property.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___nodes.html

ENsetoption(optioncode, value)[source]
Sets the value for an anlysis option.

ENsetoption(optioncode, value)

Parameters: optioncode a type of analysis option (see EN_Option). value the new value assigned to the option.

ENsetpattern(index, factors, nfactors)[source]
Sets the pattern factors for a given time pattern.

ENsetpattern(index, factors, nfactors)

Parameters: index a time pattern index (starting from 1). factors an array of new pattern factor values. nfactors the number of factor values supplied.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___patterns.html

ENsetpatternid(index, Id)[source]
Changes the ID name of a time pattern given its index.

ENsetpatternid(index, id)

Parameters: index a time pattern index (starting from 1). id the time pattern’s new ID name.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___patterns.html

ENsetpatternvalue(index, period, value)[source]
Sets a time pattern’s factor for a given time period.

ENsetpatternvalue(index, period, value)

Parameters: index a time pattern index (starting from 1). period a time period in the pattern (starting from 1). value the new value of the pattern factor for the given time period.

ENsetpipedata(index, length, diam, rough, mloss)[source]
Sets a group of properties for a pipe link.

ENsetpipedata(index, length, diam, rough, mloss)

Parameters: index the index of a pipe link (starting from 1). length the pipe’s length. diam the pipe’s diameter. rough the pipe’s roughness coefficient. mloss the pipe’s minor loss coefficient.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___links.html

ENsetpremise(ruleIndex, premiseIndex, logop, object_, objIndex, variable, relop, status, value)[source]
Sets the properties of a premise in a rule-based control.

ENsetpremise(ruleIndex, premiseIndex, logop, object, objIndex, variable, relop, status, value)

Parameters: ruleIndex the rule’s index (starting from 1). premiseIndex the position of the premise in the rule’s list of premises. logop the premise’s logical operator ( IF = 1, AND = 2, OR = 3 ). object_ the type of object the premise refers to (see RULEOBJECT). objIndex the index of the object (e.g. the index of a tank). variable the object’s variable being compared (see RULEVARIABLE). relop the premise’s comparison operator (see RULEOPERATOR). status the status that the object’s status is compared to (see RULESTATUS). value the value that the object’s variable is compared to.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___rules.html

ENsetpremiseindex(ruleIndex, premiseIndex, objIndex)[source]
Sets the index of an object in a premise of a rule-based control.

ENsetpremiseindex(ruleIndex, premiseIndex, objIndex)

Parameters: ruleIndex the rule’s index (starting from 1). premiseIndex the premise’s index (starting from 1). objIndex the index of the object (e.g. the index of a tank).

ENsetpremisestatus(ruleIndex, premiseIndex, status)[source]
Sets the status being compared to in a premise of a rule-based control.

ENsetpremisestatus(ruleIndex, premiseIndex, status)

Parameters: ruleIndex the rule’s index (starting from 1). premiseIndex the premise’s index (starting from 1). status the status that the premise’s object status is compared to (see RULESTATUS).

ENsetpremisevalue(ruleIndex, premiseIndex, value)[source]
Sets the value in a premise of a rule-based control.

ENsetpremisevalue(ruleIndex, premiseIndex, value)

Parameters: ruleIndex the rule’s index (starting from 1). premiseIndex the premise’s index (starting from 1). value The value that the premise’s variable is compared to.

ENsetqualtype(qualcode, chemname, chemunits, tracenode)[source]
Sets the type of water quality analysis to run.

ENsetqualtype(qualcode, chemname, chemunits, tracenode)

Parameters: qualcode the type of analysis to run (see EN_QualityType, self.QualityType). chemname the name of the quality constituent. chemunits the concentration units of the constituent. tracenode a type of analysis option (see ENOption).

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___options.html

ENsetreport(command)[source]
Processes a reporting format command.

ENsetreport(command)

Parameters: command a report formatting command.

See also ENreport

ENsetrulepriority(ruleIndex, priority)[source]
Sets the priority of a rule-based control.

ENsetrulepriority(ruleIndex, priority)

Parameters: ruleIndex the rule’s index (starting from 1). priority the priority value assigned to the rule.

ENsetstatusreport(statuslevel)[source]
Sets the level of hydraulic status reporting.

ENsetstatusreport(statuslevel)

Parameters: statuslevel a status reporting level code (see EN_StatusReport).

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___reporting.html

ENsettankdata(index, elev, initlvl, minlvl, maxlvl, diam, minvol, volcurve)[source]
Sets a group of properties for a tank node.

ENsettankdata(index, elev, initlvl, minlvl, maxlvl, diam, minvol, volcurve)

Parameters: index a tank node’s index (starting from 1). elev the tank’s bottom elevation. initlvl the initial water level in the tank. minlvl the minimum water level for the tank. maxlvl the maximum water level for the tank. diam the tank’s diameter (0 if a volume curve is supplied). minvol the new value for the property. volcurve the volume of the tank at its minimum water level.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___nodes.html

ENsetthenaction(ruleIndex, actionIndex, linkIndex, status, setting)[source]
Sets the properties of a THEN action in a rule-based control.

ENsetthenaction(ruleIndex, actionIndex, linkIndex, status, setting)

Parameters: ruleIndex the rule’s index (starting from 1). actionIndex the index of the THEN action to retrieve (starting from 1). linkIndex the index of the link in the action. status the new status assigned to the link (see EN_RuleStatus).. setting the new value assigned to the link’s setting.

ENsettimeparam(paramcode, timevalue)[source]
Sets the value of a time parameter.

ENsettimeparam(paramcode, timevalue)

Parameters: paramcode a time parameter code (see EN_TimeParameter). timevalue the new value of the time parameter (in seconds).

ENsettitle(line1, line2, line3)[source]
Sets the title lines of the project.

ENsettitle(line1, line2, line3)

Parameters: line1 first title line line2 second title line line3 third title line

ENsetvertices(index, x, y, vertex)[source]
Assigns a set of internal vertex points to a link.

ENsetvertices(index, x, y, vertex)

Parameters: index a link’s index (starting from 1). x an array of X-coordinates for the vertex points. y an array of Y-coordinates for the vertex points. vertex the number of vertex points being assigned.

ENsolveH()[source]
Runs a complete hydraulic simulation with results for all time periods written to a temporary hydraulics file.

ENsolveH()

See also ENopenH, ENinitH, ENrunH, ENnextH, ENcloseH OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___hydraulics.html

ENsolveQ()[source]
Runs a complete water quality simulation with results at uniform reporting intervals written to the project’s binary output file.

ENsolveQ()

See also ENopenQ, ENinitQ, ENrunQ, ENnextQ, ENcloseQ OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___hydraulics.html

ENstepQ()[source]
Advances a water quality simulation by a single water quality time step.

ENstepQ()

Returns: tleft time left (in seconds) to the overall simulation duration.

See also ENrunQ, ENnextQ OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___hydraulics.html

ENusehydfile(hydfname)[source]
Uses a previously saved binary hydraulics file to supply a project’s hydraulics.

ENusehydfile(hydfname)

Parameters: hydfname the name of the binary file containing hydraulic results.

OWA-EPANET Toolkit: http://wateranalytics.org/EPANET/group___hydraulics.html

ENwriteline(line)[source]
Writes a line of text to a project’s report file.

ENwriteline(line)

Parameters: line a text string to write.

classepyt.epanet.epanetmsxapi(msxfile='', loadlib=True, ignore_msxfile=False, customMSXlib=None, display_msg=True, msxrealfile='')[source]
Bases: error_handler

example msx = epanetmsxapi()

MSXaddpattern(pattern_id)[source]
Adds a newm empty MSX source time pattern to an MSX project
MSXaddpattern(pattern_id)

Parameters:
pattern_id: the name of the new pattern

MSXclose()[source]
Close .msx file example : msx.MSXclose()

MSXerror(err_code)[source]
Function that every other function uses in case of an error

MSXgetID(obj_type, index, id_len=80)[source]
Retrieves the ID name of an object given its internal index number msx.MSXgetID(obj_type, index, id_len) print(msx.MSXgetID(3,1,8))

Parameters:
obj_type: type of object being sought and must be on of the following pre-defined constants: MSX_SPECIES (for chemical species) MSX_CONSTANT(for reaction constant) MSX_PARAMETER(for a reaction parameter) MSX_PATTERN (for a time pattern)

index: the sequence number of the object (starting from 1 as listed in the MSX input file)

id_len: the maximum number of characters that id can hold

Returns:
id object’s ID name

MSXgetIDlen(obj_type, index)[source]
Retrieves the number of characters in the ID name of an MSX object given its internal index number msx.MSXgetIDlen(obj_type, index) print(msx.MSXgetIDlen(3,3)) Parameters:

obj_type: type of object being sought and must be on of the
following pre-defined constants: MSX_SPECIES (for chemical species) MSX_CONSTANT(for reaction constant) MSX_PARAMETER(for a reaction parameter) MSX_PATTERN (for a time pattern)

index: the sequence number of the object (starting from 1
as listed in the MSX input file)

Returns : the number of characters in the ID name of MSX object

MSXgetconstant(index)[source]
Retrieves the value of a particular rection constant

MSXgetcount(code)[source]
Retrieves the number of objects of a specific type MSXgetcount(code)

Parameters:
code type of object being sought and must be one of the following pre-defined constants: MSX_SPECIES (for a chemical species) the number 3 MSX_CONSTANT (for a reaction constant) the number 6 MSX_PARAMETER (for a reaction parameter) the number 5 MSX_PATTERN (for a time pattern) the number 7

Returns:
The count number of object of that type.

MSXgeterror(err)[source]
Returns the text for an error message given its error code. msx.MSXgeterror(err) msx.MSXgeterror(516) Parameters:

err: the code number of an error condition generated by EPANET-MSX

Returns:
errmsg: the text of the error message corresponding to the error code

MSXgetindex(obj_type, obj_id)[source]
Retrieves the number of objects of a specific type MSXgetcount(obj_type, obj_id)

Parameters:
obj_type: code type of object being sought and must be one of the following pre-defined constants: MSX_SPECIES (for a chemical species) the number 3 MSX_CONSTANT (for a reaction constant) the number 6 MSX_PARAMETER (for a reaction parameter) the number 5 MSX_PATTERN (for a time pattern) the number 7

obj_id: string containing the object’s ID name

Returns:
The index number (starting from 1) of object of that type with that specific name.

MSXgetinitqual(obj_type, index, species)[source]
Retrieves the intial concetration of a particular chemical species
assigned to a specific node or link of the pipe network

msx.MSXgetinitqual(obj_type, index) msx.MSXgetinitqual(1,1,1)

Parameters:

typetype of object being queeried and must be either:
MSX_NODE (defined as 0) for a node or , MSX_LINK (defined as 1) for a link

indexthe internal sequence number (starting from 1) assigned
to the node or link

species: the sequence number of the species (starting from 1)

Returns:
value: the initial concetration of the species at the node or
link of interest.

MSXgetparameter(obj_type, index, param)[source]
Retrieves the value of a particular reaction parameter for a given pipe msx.MSXgetparameter(obj_type, index, param) msx.MSXgetparameter(1,1,1) Parameters:

obj_type: is type of object being queried and must be either:
MSX_NODE (defined as 0) for a node or MSX_LINK(defined as 1) for alink

index: is the internal sequence number (starting from 1)
assigned to the node or link

param: the sequence number of the parameter (starting from 1
as listed in the MSX input file)

Returns:
valuethe value assigned to the parameter for the node or link
of interest.

MSXgetpatternlen(pattern_index)[source]
Retrieves the number of time periods within a source time pattern

MSXgetpatternlen(pattern_index)

Parameters:
pattern_index: the internal sequence number (starting from 1)
of the pattern as it appears in the MSX input file.

Returns:
len: the number of time periods (and therefore number of multipliers)
that appear in the pattern.

MSXgetpatternvalue(pattern_index, period)[source]
Retrieves the multiplier at a specific time period for a
given source time pattern

msx.MSXgetpatternvalue(pattern_index, period) msx.MSXgetpatternvalue(1,1)

Parameters:
pattern_index: the internal sequence number(starting from 1) of the pattern as it appears in the MSX input file

period: the index of the time period (starting from 1) whose multiplier is being sought

MSXgetqual(type, index, species)[source]
Retrieves a chemical species concentration at a given node or the average concentration along a link at the current sumulation time step.

MSXgetqual(type, index, species)

Parameters:
type: type of object being queried and must be either:
MSX_NODE ( defined as 0) for a node, MSX_LINK (defined as 1) for a link

index: then internal sequence number (starting from 1)
assigned to the node or link.

species is the sequence number of the species (starting from 1 as listed in the MSX input file)

Returns:
The value of the computed concentration of the species at the current time period.

MSXgetsource(node_index, species_index)[source]
Retrieves information on any external source of a particular chemical species assigned to a specific node or link of the pipe network. msx.MSXgetsource(node_index, species_index) msx.MSXgetsource(1,1)

Parameters:
node_index: the internal sequence number (starting from 1) assigned to the node of interest.

species_index: the sequence number of the species of interest (starting from 1 as listed in MSX input file)

Returns:

type: the type of external source to be utilized and will be one of
the following predefined constants:

MSX_NOSOURCE (defined as -1) for no source MSX_CONCEN (defined as 0) for a concetration sourc MSX_MASS (defined as 1) for a mass booster source MSX_SETPOINT (defined as 2) for a setpoint source MSX_FLOWPACE (defined as 3) for a flow paced source

level: the baseline concentration ( or mass flow rate) of the source)

patthe index of the time pattern used to add variability to the
the source’s baseline level (and will be 0 if no pattern was defined for the source)

MSXgetspecies(index)[source]
Retrieves the attributes of a chemical species given its internal index number msx.MSXgetspecies(index) msx.MSXgetspecies(1) Parameters:

index : integer -> sequence number of the species

Returns:
typeis returned with one of the following pre-defined constants:
MSX_BULK (defined as 0) for a bulk water species , or MSX_WALL (defined as 1) for a pipe wall surface species

units: mass units that were defined for the species in question atol : the absolute concentration tolerance defined for the species. rtol : the relative concentration tolerance defined for the species.

MSXinit(flag)[source]
Initialize the MSX system before solving for water quality results in the step-wise fashion

MSXinit(flag)

Parameters:
flag: Set the flag to 1 if the water quality results should be saved
to a scratch binary file, or 0 if not

MSXopen(msxfile, msxrealfile)[source]
Open MSX file filename - Arsenite.msx or use full path

Example:
msx.MSXopen(filename) msx.MSXopen(Arsenite.msx)

MSXreport()[source]
Writes water quality simulations results as instructed by MSX input file to a text file. msx.MSXreport()

MSXsavemsxfile(filename)[source]
Saves the data associated with the current MSX project into a new MSX input file msx.MSXsavemsxfile(filename) msx.MSXsavemsxfile(Arsenite.msx)

Parameters:
filename: name of the file to which data are saved

MSXsaveoutfile(filename)[source]
Saves water quality results computed for each node, link and reporting time period to a named binary file. msx.MSXsaveoutfile(filename) msx.MSXsaveoufile(Arsenite.msx)

Parameters:
filename: name of the permanent output results file

MSXsetconstant(index, value)[source]
Assigns a new value to a specific reaction constant msx.MSXsetconstant(index, value) msx.MSXsetconstant(1,10)

MSXsetinitqual(obj_type, index, species, value)[source]
Assigns an initial concetration of a particular chemical species node or link of the pipe network msx.MSXsetinitqual(obj_type, index, species, value) msx.MSXsetinitqual(1,1,1,15) Parameters:

type: type of object being queried and must be either :
MSX_NODE(defined as 0) for a node or MSX_LINK(defined as 1) for a link

index: integer -> the internal sequence number (starting from 1)
assigned to the node or link

species: the sequence number of the species (starting from 1 as listed in MASx input file)

value: float -> the initial concetration of the species to be applied at the node or link
of interest.

MSXsetparameter(obj_type, index, param, value)[source]
Assigns a value to a particular reaction parameter for a given pipe or tank within the pipe network msx.MSXsetparameter(obj_type, index, param, value) msx.MSXsetparameter(1,1,1,15) Parameters:

obj_type: is type of object being queried and must be either:
MSX_NODE (defined as 0) for a node or MSX_LINK (defined as 1) for a link

index: is the internal sequence number (starting from 1)
assigned to the node or link

param: the sequence number of the parameter (starting from 1
as listed in the MSX input file)

value: the value to be assigned to the parameter for the node or
link of interest.

MSXsetpattern(index, factors, nfactors)[source]
Assigns a new set of multipliers to a given MSX source time pattern MSXsetpattern(index,factors,nfactors)

Parameters:
index: the internal sequence number (starting from 1)
of the pattern as it appers in the MSX input file

factors: an array of multiplier values to replace those previously used by
the pattern

nfactors: the number of entries in the multiplier array/ vector factors

MSXsetpatternvalue(pattern, period, value)[source]
Assigns a new value to the multiplier for a specific time period
in a given MSX source time pattern.

msx.MSXsetpatternvalue(pattern, period, value) msx.MSXsetpatternvalue(1,1,10)

Parameters:
pattern: the internal sequence number (starting from 1) of the pattern as it appears in the MSX input file.

period: the time period (starting from 1) in the pattern to be replaced value: the new multiplier value to use for that time period.

MSXsetsource(node, species, type, level, pat)[source]
“Sets the attributes of an external source of particular chemical species to specific node of the pipe network msx.setsource(node, species, type, level, pat) msx.MSXsetsource(1,1,3,10.565,1) Parameters:

node: the internal sequence number (starting from1) assigned
to the node of interest.

species: the sequence number of the species of interest (starting
from 1 as listed in the MSX input file)

type: the type of external source to be utilized and will be one of
the following predefined constants: MSX_NOSOURCE (defined as -1) for no source MSX_CONCEN (defined as 0) for a concetration source MSX_MASS (defined as 1) for a mass booster source MSX_SETPOINT (defined as 2) for a setpoint source MSX_FLOWPACE (defined as 3) for a flow paced source

level: the baseline concetration (or mass flow rate) of the source

pat: the index of the time pattern used to add variability to the
source’s baseline level ( use 0 if the source has a constant strength)

MSXsolveH()[source]
Solves for system hydraulics over the entire simulation period saving results to an internal scratch file msx.MSXsolveH()

MSXsolveQ()[source]
Solves for water quality over the entire simulation period and saves the results to an internal scratch file msx.MSXsolveQ()

MSXstep()[source]
Advances the water quality solution through a single water quality time step when performing a step-wise simulation

t, tleft = MSXstep() Returns:

t : current simulation time at the end of the step(in secconds) tleft: time left in the simulation (in secconds)

MSXusehydfile(filename)[source]
classepyt.epanet.error_handler[source]
Bases: object

last_error= None
epyt.epanet.isList(var)[source]
epyt.epanet.safe_delete(file)[source]
© Copyright 2022, KIOS Research and Innovation Center of Excellence.

Built with Sphinx using a theme provided by Read the Docs.