import unittest
from TEMP import Temprature, cleaner
from main import main_runner

class TestAddFunction(unittest.TestCase):
    # coordinates = [[73.6472229107984, 20.04490099327118], [73.6527160748609, 20.041514436506176], [73.65752259341559, 20.042159500567656], [73.6607841595777, 20.041191903481952]]


    coordinates = [[73.63094099902071,20.055394638965012],[73.63434958197922,20.054902039479046],[73.6356081356875,20.0524882796485],[73.63870208021893,20.0524882796485],[73.63912159812074,20.050813404076365],[73.64939978673559,20.048596629518485],[73.64976542538648,20.049640472607578],[73.65147199948419,20.050748098771905],[73.65258902980156,20.04856198699163],[73.65401634632002,20.050194286666184],[73.65569189179766,20.049086656594596],[73.65763334926072,20.050676908382727],[73.65891468459631,20.050512771032402],[73.6593223822019,20.052646543199288],[73.66287517563234,20.051607016792488],[73.66316638820854,20.050676908382727],[73.66543784630343,20.050950470251593],[73.66596202894164,20.049582656139506],[73.66805875948998,20.049965645291792],[73.66949267841193,20.047871564180383],[73.6713656915939,20.049058213266832],[73.67018961354935,20.053027284695816],[73.6713656915939,20.05384563745929],[73.67336938011485,20.05282269583722],[73.67650558823408,20.05331370864775],[73.67628779600363,20.051022302392198],[73.67803013384676,20.05126781180526],[73.67750743249448,20.04967199375895],[73.67903197810719,20.048526268234042],[73.6787858796005,20.040089716504596],[73.67952902550974,20.031811425662383],[73.68287487873596,20.02775131213538],[73.68436762601473,20.02383152222525],[73.68306625659298,20.022285156203054],[73.67988938418043,20.024191140050448],[73.67904732161355,20.02339997974886],[73.67962145518263,20.021745722616473],[73.67812870790587,20.02178168491325],[73.67736319647975,20.020415111858796],[73.67365046607156,20.02214130742709],[73.6711256034842,20.021694606926317],[73.66977227672311,20.02075601408356],[73.66656088555624,20.018615986113545],[73.6647295754872,20.017563317783257],[73.66442598371918,20.01634451289972],[73.65965131318433,20.01281770513681],[73.6575200659911,20.012219952103848],[73.65534423950677,20.013193496390258],[73.65430813165798,20.012025242523947],[73.65461896401288,20.011149046430262],[73.65428002102203,20.01041274698524],[73.65325083016992,20.01041274698524],[73.65342981988303,20.008688849650454],[73.65202027589046,20.009067267756308],[73.65177399699863,20.008414328770044],[73.65136360231423,20.00832725230495],[73.6512179783929,20.00693402230621],[73.65198581360994,20.00637423892219],[73.65212213127896,20.00605545167562],[73.65256046635665,20.005813166554375],[73.65234559622098,20.005570881059285],[73.65219088972265,20.005813166554375],[73.65195882997602,20.005797014199587],[73.65159784814844,20.006111984817295],[73.65111653904611,20.005974690010248],[73.65111653904611,20.005005546787388],[73.65022267928163,20.004625964065283],[73.64927397956819,20.0045107117555],[73.6487415923132,20.002630912988593],[73.64711216465034,20.002812829979575],[73.64704763286139,20.00441975426712],[73.64745095654033,20.00499581746986],[73.6463861820286,20.00631469107182],[73.64523755195299,20.006249600545956],[73.6435104430515,20.004781080324662],[73.6434632279526,20.00411558393499],[73.64539904699797,20.001719773635685],[73.6460118848934,20.001019876485543],[73.64755567117041,20.00032607378607],[73.6461908746065,19.999632268028762],[73.64543016832448,19.999653292490706],[73.64350602890585,20.000199927511602],[73.64319279690716,20.002617713495297],[73.64188554482504,20.004730012735536],[73.64188554482504,20.00765070196607],[73.64278530279549,20.008034999144712],[73.64319428369166,20.00898292817277],[73.6464388654635,20.011314296892692],[73.64570366120844,20.01325730909811],[73.64398177297923,20.01471569950229],[73.64412728466004,20.016629816385503],[73.64650397545614,20.015353741051186],[73.6473042897039,20.016493094524066],[73.64572791315544,20.018088175518088],[73.64587342483753,20.019979464877125],[73.64861389483636,20.018042601999653],[73.64988326205525,20.019983663100334],[73.64921756107896,20.02102611772034],[73.64760878372002,20.02264190872239],[73.65065991319312,20.02363222403254],[73.65282344136506,20.03301384903439],[73.66020813767372,20.038276651680263],[73.65744206043846,20.040875259957076],[73.65329294458718,20.03940648664829],[73.65154911328665,20.04008438372786],[73.64986541410019,20.03844612744355],[73.65028633889716,20.040479822340586],[73.6470458431805,20.042397766864966],[73.64632886474988,20.04320274839121],[73.6448599333309,20.042972754090087],[73.64569932271371,20.044237718576838],[73.64380705483185,20.045510649761155],[73.64158219131315,20.04544394497826],[73.64224491661614,20.047534014699508],[73.64058810335786,20.04717826011546],[73.64030407822762,20.048734680467703],[73.63767684577391,20.049001493836087],[73.63817388975144,20.050268851142135],[73.63560934586019,20.05085257373345],[73.63313466528734,20.05271231227637],[73.63359546787555,20.05399487774349],[73.6329601230158,20.054229793096212],[73.62964311104469,20.05257700451304],[73.63019113910889,20.054067224499676],[73.63122950807403,20.054175603582962],[73.63094099902071,20.055394638965012]]


    # swapped vales
    # coordinates = [[20.055394638965012, 73.63094099902071], [20.054902039479046, 73.63434958197922], [20.0524882796485, 73.6356081356875], [20.0524882796485, 73.63870208021893], [20.050813404076365, 73.63912159812074], [20.048596629518485, 73.64939978673559], [20.049640472607578, 73.64976542538648], [20.050748098771905, 73.65147199948419], [20.04856198699163, 73.65258902980156], [20.050194286666184, 73.65401634632002], [20.049086656594596, 73.65569189179766], [20.050676908382727, 73.65763334926072], [20.050512771032402, 73.65891468459631], [20.052646543199288, 73.6593223822019], [20.051607016792488, 73.66287517563234], [20.050676908382727, 73.66316638820854], [20.050950470251593, 73.66543784630343], [20.049582656139506, 73.66596202894164], [20.049965645291792, 73.66805875948998], [20.047871564180383, 73.66949267841193], [20.049058213266832, 73.6713656915939], [20.053027284695816, 73.67018961354935], [20.05384563745929, 73.6713656915939], [20.05282269583722, 73.67336938011485], [20.05331370864775, 73.67650558823408], [20.051022302392198, 73.67628779600363], [20.05126781180526, 73.67803013384676], [20.04967199375895, 73.67750743249448], [20.048526268234042, 73.67903197810719], [20.040089716504596, 73.6787858796005], [20.031811425662383, 73.67952902550974], [20.02775131213538, 73.68287487873596], [20.02383152222525, 73.68436762601473], [20.022285156203054, 73.68306625659298], [20.024191140050448, 73.67988938418043], [20.02339997974886, 73.67904732161355], [20.021745722616473, 73.67962145518263], [20.02178168491325, 73.67812870790587], [20.020415111858796, 73.67736319647975], [20.02214130742709, 73.67365046607156], [20.021694606926317, 73.6711256034842], [20.02075601408356, 73.66977227672311], [20.018615986113545, 73.66656088555624], [20.017563317783257, 73.6647295754872], [20.01634451289972, 73.66442598371918], [20.01281770513681, 73.65965131318433], [20.012219952103848, 73.6575200659911], [20.013193496390258, 73.65534423950677], [20.012025242523947, 73.65430813165798], [20.011149046430262, 73.65461896401288], [20.01041274698524, 73.65428002102203], [20.01041274698524, 73.65325083016992], [20.008688849650454, 73.65342981988303], [20.009067267756308, 73.65202027589046], [20.008414328770044, 73.65177399699863], [20.00832725230495, 73.65136360231423], [20.00693402230621, 73.6512179783929], [20.00637423892219, 73.65198581360994], [20.00605545167562, 73.65212213127896], [20.005813166554375, 73.65256046635665], [20.005570881059285, 73.65234559622098], [20.005813166554375, 73.65219088972265], [20.005797014199587, 73.65195882997602], [20.006111984817295, 73.65159784814844], [20.005974690010248, 73.65111653904611], [20.005005546787388, 73.65111653904611], [20.004625964065283, 73.65022267928163], [20.0045107117555, 73.64927397956819], [20.002630912988593, 73.6487415923132], [20.002812829979575, 73.64711216465034], [20.00441975426712, 73.64704763286139], [20.00499581746986, 73.64745095654033], [20.00631469107182, 73.6463861820286], [20.006249600545956, 73.64523755195299], [20.004781080324662, 73.6435104430515], [20.00411558393499, 73.6434632279526], [20.001719773635685, 73.64539904699797], [20.001019876485543, 73.6460118848934], [20.00032607378607, 73.64755567117041], [19.999632268028762, 73.6461908746065], [19.999653292490706, 73.64543016832448], [20.000199927511602, 73.64350602890585], [20.002617713495297, 73.64319279690716], [20.004730012735536, 73.64188554482504], [20.00765070196607, 73.64188554482504], [20.008034999144712, 73.64278530279549], [20.00898292817277, 73.64319428369166], [20.011314296892692, 73.6464388654635], [20.01325730909811, 73.64570366120844], [20.01471569950229, 73.64398177297923], [20.016629816385503, 73.64412728466004], [20.015353741051186, 73.64650397545614], [20.016493094524066, 73.6473042897039], [20.018088175518088, 73.64572791315544], [20.019979464877125, 73.64587342483753], [20.018042601999653, 73.64861389483636], [20.019983663100334, 73.64988326205525], [20.02102611772034, 73.64921756107896], [20.02264190872239, 73.64760878372002], [20.02363222403254, 73.65065991319312], [20.03301384903439, 73.65282344136506], [20.038276651680263, 73.66020813767372], [20.040875259957076, 73.65744206043846], [20.03940648664829, 73.65329294458718], [20.04008438372786, 73.65154911328665], [20.03844612744355, 73.64986541410019], [20.040479822340586, 73.65028633889716], [20.042397766864966, 73.6470458431805], [20.04320274839121, 73.64632886474988], [20.042972754090087, 73.6448599333309], [20.044237718576838, 73.64569932271371], [20.045510649761155, 73.64380705483185], [20.04544394497826, 73.64158219131315], [20.047534014699508, 73.64224491661614], [20.04717826011546, 73.64058810335786], [20.048734680467703, 73.64030407822762], [20.049001493836087, 73.63767684577391], [20.050268851142135, 73.63817388975144], [20.05085257373345, 73.63560934586019], [20.05271231227637, 73.63313466528734], [20.05399487774349, 73.63359546787555], [20.054229793096212, 73.6329601230158], [20.05257700451304, 73.62964311104469], [20.054067224499676, 73.63019113910889], [20.054175603582962, 73.63122950807403], [20.055394638965012, 73.63094099902071]]

    output = {'2024-01-11': 32.6, '2024-01-27': 30.26, '2024-02-12': 28.76, '2024-02-28': 39.88, '2024-03-15': 44.39, '2024-03-31': 48.07, '2024-04-16': 54.2, '2024-05-02': 54.23, '2024-05-18': 49.09, '2024-06-03': 26.74, '2024-06-19': 15.21, '2024-08-22': 9.72, '2024-10-09': -66.92, '2024-10-25': 30.76, '2024-11-10': 35.23, '2024-11-26': 30.72, '2024-12-12': 31.62, '2024-12-28': 26.32}

    raw_data = {'2015-01-02': 17.856203290387, '2015-01-18': 31.3510468602301, '2015-02-03': 34.6749853069583, '2015-02-19': 39.81140094806101, '2015-03-07': 42.2520104625825, '2015-03-23': 47.6573935642514, '2015-04-08': 47.6786304349059, '2015-04-24': 52.61109162199182, '2015-05-10': 54.8521097085051, '2015-05-26': 49.3324915556009, '2015-06-27': 32.22138808755687, '2015-07-13': 35.8463689962787, '2015-08-30': 2.271614268380756, '2015-10-01': 42.812369154729, '2015-10-17': 39.6043221765122, '2015-11-02': 36.45722804301172, '2015-11-18': 37.0740477101604, '2015-12-04': 35.36504029180087, '2015-12-20': 35.450199674538, '2016-01-05': 34.4837800377993, '2016-01-21': 30.660727370876, '2016-02-06': 36.6823067891536, '2016-02-22': 27.50370098171747, '2016-03-09': 43.44111114115569, '2016-03-25': 45.3748348086412, '2016-04-10': 53.7433423843744, '2016-04-26': 55.3541524944611, '2016-05-12': 50.8667027612945, '2016-05-28': 45.53809506665372, '2016-06-13': 39.4640210026336, '2016-08-16': 13.01652310964308, '2016-10-19': 36.36291808314, '2016-11-04': 35.790357035516, '2016-11-20': 35.1638290981043, '2016-12-06': 32.8010890094662, '2016-12-22': 33.532495401391, '2017-01-07': 31.7380807293703, '2017-01-23': 34.8737812689429, '2017-02-08': 36.6821998891655, '2017-02-24': 41.3371466833463, '2017-03-12': 39.798742021842, '2017-03-28': 51.44800173662676, '2017-04-13': 52.6379906789015, '2017-04-29': 52.19784839027952, '2017-05-15': 44.8942859585588, '2017-05-31': 50.2635985793583, '2017-06-16': 30.6813640920444, '2017-09-04': 28.6526986713305, '2017-10-06': 31.9873430793588, '2017-10-22': 37.68875318555648, '2017-11-07': 36.19548479459482, '2017-11-23': 35.5393959828631, '2017-12-09': 33.0917823200106, '2017-12-25': 31.8963096324462, '2018-01-10': 30.10705038383563, '2018-01-26': 32.6576315215465, '2018-02-11': 32.0419882255123, '2018-02-27': 34.6797713805127, '2018-03-15': 7.03600300872211, '2018-03-31': 49.1335507568458, '2018-04-16': 52.0838863197578, '2018-05-02': 54.3761603362769, '2018-05-18': 50.4816221655897, '2018-06-19': 39.9067739817888, '2018-09-07': 24.4357347931264, '2018-09-23': 36.6320409134436, '2018-10-09': 43.64042692734728, '2018-10-25': 40.10550242070693, '2018-11-10': 39.39222159210158, '2018-11-26': 22.70665961027994, '2018-12-12': 34.2991138858885, '2018-12-28': 26.7498607731635, '2019-01-13': 33.1943471824225, '2019-01-29': 30.05472967166553, '2019-02-14': 35.94571103488454, '2019-03-02': 41.26958687238829, '2019-03-18': 47.6236493939135, '2019-04-03': 52.18384265846566, '2019-04-19': 52.7258998073415, '2019-05-05': 54.38642687589466, '2019-05-21': 58.7986104314349, '2019-06-06': 14.16224902276635, '2019-06-22': 47.8734838752298, '2019-07-24': 8.5596143345887, '2019-10-12': 35.0978838264354, '2019-10-28': 28.10618119663339, '2019-11-13': 33.1604118092232, '2019-11-29': 32.2388645441183, '2019-12-15': 31.40698222084716, '2019-12-31': 30.04648149808212, '2020-01-16': 28.04977108508411, '2020-02-01': 31.27467482185664, '2020-02-17': 36.8996046911941, '2020-03-04': 37.58896571335, '2020-03-20': 41.30133144825611, '2020-04-05': 49.8735651405427, '2020-04-21': 53.86947357897733, '2020-05-07': 55.3781647394366, '2020-05-23': 55.19183321401738, '2020-06-08': 21.19208143081882, '2020-06-24': 39.7220427212168, '2020-07-26': 21.23701085869795, '2020-09-12': 32.60457163309569, '2020-09-28': 34.74834477416846, '2020-10-30': 37.8798326941211, '2020-11-15': 37.652979843073, '2020-12-01': 38.2961261029092, '2021-01-18': 36.1745500893874, '2021-03-23': 35.74740905733, '2021-04-08': 45.46485306724317, '2021-04-24': 53.84743962805201, '2021-05-10': 55.24826578443252, '2021-05-26': 26.43504892499185, '2021-06-11': 12.0377495038036, '2021-10-01': 25.79955649315639, '2021-11-02': 33.481522952419, '2021-11-18': 27.96245119630886, '2021-12-04': 28.79310558098359, '2021-12-20': 28.9123749163737, '2022-01-05': 31.15314949543166, '2022-03-26': 32.43410342232614, '2022-04-11': 41.56953565744366, '2022-04-27': 53.3018675, '2022-05-13': 27.8536097, '2022-05-29': 42.7621698, '2022-06-30': 4.97880736, '2022-08-01': 2.781347698442683, '2022-09-02': 23.046181, '2022-10-04': 31.284896, '2022-10-20': 0.928866557111131, '2022-11-05': 35.5022215, '2022-11-21': 32.26805352583206, '2022-12-07': 32.67599890141444, '2022-12-23': 33.058573, '2023-01-08': 30.64545189674883, '2023-01-24': 30.8546189, '2023-02-09': 36.3284459, '2023-02-25': 39.326219, '2023-03-13': 30.98030648862676, '2023-03-29': 45.3506301, '2023-04-30': 29.8679313, '2023-05-16': 51.12627555004253, '2023-06-01': 55.24120526791285, '2023-06-17': 36.03448751803253, '2023-09-05': 27.2095372958142, '2023-09-21': 19.87812460769812, '2023-10-07': 37.941127, '2023-10-23': 35.9360646, '2023-11-08': 28.926547, '2023-11-24': 30.52434594791508, '2023-12-10': 32.5461932, '2023-12-26': 33.6049943021423, '2024-01-11': 32.5964918359644, '2024-01-27': 30.25718293614171, '2024-02-12': 28.75528331486105, '2024-02-28': 39.87539892001916, '2024-03-15': 44.384137771413, '2024-03-31': 48.0701620551038, '2024-04-16': 54.1938213678176, '2024-05-02': 54.23250788053163, '2024-05-18': 49.08971227744263, '2024-06-03': 26.73770352468, '2024-06-19': 15.21562815367328, '2024-08-22': 9.71709666004785, '2024-12-28': 26.32149404}

    cleaned_data = {'2015-01-02': 17.856203290387, '2015-01-18': 31.3510468602301, '2015-02-03': 34.6749853069583, '2015-02-19': 39.81140094806101, '2015-03-07': 42.2520104625825, '2015-03-23': 47.6573935642514, '2015-04-08': 47.6786304349059, '2015-05-26': 49.3324915556009, '2015-06-27': 32.22138808755687, '2015-07-13': 35.8463689962787, '2015-08-30': 26.976784139796152, '2015-10-01': 42.812369154729, '2015-10-17': 39.6043221765122, '2015-11-02': 36.45722804301172, '2015-11-18': 37.0740477101604, '2015-12-04': 35.36504029180087, '2015-12-20': 35.450199674538, '2016-01-05': 34.4837800377993, '2016-01-21': 30.660727370876, '2016-02-06': 36.6823067891536, '2016-02-22': 27.50370098171747, '2016-03-09': 43.44111114115569, '2016-03-25': 45.3748348086412, '2016-05-28': 45.53809506665372, '2016-06-13': 39.4640210026336, '2016-08-16': 29.61448739847223, '2016-10-19': 36.36291808314, '2016-11-04': 35.790357035516, '2016-11-20': 35.1638290981043, '2016-12-06': 32.8010890094662, '2016-12-22': 33.532495401391, '2017-01-07': 31.7380807293703, '2017-01-23': 34.8737812689429, '2017-02-08': 36.6821998891655, '2017-02-24': 41.3371466833463, '2017-03-12': 39.798742021842, '2017-05-15': 44.8942859585588, '2017-06-16': 30.6813640920444, '2017-09-04': 28.6526986713305, '2017-10-06': 31.9873430793588, '2017-10-22': 37.68875318555648, '2017-11-07': 36.19548479459482, '2017-11-23': 35.5393959828631, '2017-12-09': 33.0917823200106, '2017-12-25': 31.8963096324462, '2018-01-10': 30.10705038383563, '2018-01-26': 32.6576315215465, '2018-02-11': 32.0419882255123, '2018-02-27': 34.6797713805127, '2018-03-15': 30.28310838202687, '2018-03-31': 32.025442582452236, '2018-06-19': 39.9067739817888, '2018-09-07': 24.4357347931264, '2018-09-23': 36.6320409134436, '2018-10-09': 43.64042692734728, '2018-10-25': 40.10550242070693, '2018-11-10': 39.39222159210158, '2018-11-26': 22.70665961027994, '2018-12-12': 34.2991138858885, '2018-12-28': 26.7498607731635, '2019-01-13': 33.1943471824225, '2019-01-29': 30.05472967166553, '2019-02-14': 35.94571103488454, '2019-03-02': 41.26958687238829, '2019-03-18': 47.6236493939135, '2019-06-06': 36.55312743063655, '2019-06-22': 23.531782410861613, '2019-07-24': 30.510327345417966, '2019-10-12': 35.0978838264354, '2019-10-28': 28.10618119663339, '2019-11-13': 33.1604118092232, '2019-11-29': 32.2388645441183, '2019-12-15': 31.40698222084716, '2019-12-31': 30.04648149808212, '2020-01-16': 28.04977108508411, '2020-02-01': 31.27467482185664, '2020-02-17': 36.8996046911941, '2020-03-04': 37.58896571335, '2020-03-20': 41.30133144825611, '2020-04-05': 49.8735651405427, '2020-06-08': 36.929229764192776, '2020-06-24': 39.7220427212168, '2020-07-26': 21.23701085869795, '2020-09-12': 32.60457163309569, '2020-09-28': 34.74834477416846, '2020-10-30': 37.8798326941211, '2020-11-15': 37.652979843073, '2020-12-01': 38.2961261029092, '2021-01-18': 36.1745500893874, '2021-03-23': 35.74740905733, '2021-04-08': 45.46485306724317, '2021-05-26': 26.43504892499185, '2021-06-11': 12.0377495038036, '2021-10-01': 25.79955649315639, '2021-11-02': 33.481522952419, '2021-11-18': 27.96245119630886, '2021-12-04': 28.79310558098359, '2021-12-20': 28.9123749163737, '2022-01-05': 31.15314949543166, '2022-03-26': 32.43410342232614, '2022-04-11': 41.56953565744366, '2022-05-13': 27.8536097, '2022-05-29': 25.198195620000003, '2022-06-30': 4.97880736, '2022-08-01': 2.781347698442683, '2022-09-02': 23.046181, '2022-10-04': 31.284896, '2022-10-20': 22.57199468570371, '2022-11-05': 35.5022215, '2022-11-21': 32.26805352583206, '2022-12-07': 32.67599890141444, '2022-12-23': 33.058573, '2023-01-08': 30.64545189674883, '2023-01-24': 30.8546189, '2023-02-09': 36.3284459, '2023-02-25': 39.326219, '2023-03-13': 30.98030648862676, '2023-03-29': 45.3506301, '2023-04-30': 29.8679313, '2023-06-17': 36.03448751803253, '2023-09-05': 27.2095372958142, '2023-09-21': 19.87812460769812, '2023-10-07': 37.941127, '2023-10-23': 35.9360646, '2023-11-08': 28.926547, '2023-11-24': 30.52434594791508, '2023-12-10': 32.5461932, '2023-12-26': 33.6049943021423, '2024-01-11': 32.5964918359644, '2024-01-27': 30.25718293614171, '2024-02-12': 28.75528331486105, '2024-02-28': 39.87539892001916, '2024-03-15': 44.384137771413, '2024-03-31': 48.0701620551038, '2024-05-18': 49.08971227744263, '2024-06-03': 26.73770352468, '2024-06-19': 15.21562815367328, '2024-08-22': 9.71709666004785, '2024-12-28': 26.32149404}


    def test_Temprature_name(self):
        print("test name")
        self.assertEqual(main_runner(parameter="TEMP", coordinates= self.coordinates, start_date= "2024-01-01", end_date= "2025-01-01", name= "Gangapur dam"), self.output)


    def test_cleaner(self):
        self.assertEqual(cleaner(self.raw_data), self.cleaned_data)


    # def test_Temprature(self):
    #     print("test temp")
    #     self.assertEqual(main_runner(parameter="TEMP", coordinates= self.coordinates, start_date= "2024-01-01", end_date= "2025-01-01"), self.output)


if __name__ == '__main__':
    unittest.main()